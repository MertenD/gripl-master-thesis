"use client";

import React, {JSX, useEffect, useMemo, useRef, useState} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/input-password";
import fetchAnalysisEndpoints from "@/actions/analysis-endpoints";
import {ModelRunConfig, MultiEvaluationRequest} from "@/models/dto/MultiEvaluationRequest";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";

type EndpointChoice = "default" | "preset" | "custom";

interface ModelRowState {
    id: string;
    label: string;
    endpointChoice: EndpointChoice;
    selectedPresetEndpoint: string;
    customEndpoint: string;
    baseUrl: string | null;
    modelName: string | null;
    apiKey: string | null;
    timeoutSeconds: number | null;
}

interface EvaluationConfigCardMultiProps {
    className?: string;
    children?: JSX.Element;
    onMultiConfigChanged: (config: MultiEvaluationRequest) => void;
}

export default function EvaluationConfigCardMulti({
  className,
  children,
  onMultiConfigChanged
}: EvaluationConfigCardMultiProps) {
    const [availableEvaluationEndpoints, setAvailableEvaluationEndpoints] = useState<AnalysisEndpoint[]>([]);

    const [defaultEndpointChoice, setDefaultEndpointChoice] = useState<EndpointChoice>("preset");
    const [defaultPresetEndpoint, setDefaultPresetEndpoint] = useState<string>("");
    const [defaultCustomEndpoint, setDefaultCustomEndpoint] = useState<string>("");

    const [maxConcurrent, setMaxConcurrent] = useState<number>(4);
    const [models, setModels] = useState<ModelRowState[]>(() => [newModelRow(1)]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fetchAnalysisEndpoints().then((eps) => {
            setAvailableEvaluationEndpoints(eps);
            if (eps.length > 0 && !defaultPresetEndpoint) {
                setDefaultPresetEndpoint(eps[0].endpoint);
            }
        });
    }, []);

    const effectiveDefaultEndpoint = useMemo(() => {
        if (defaultEndpointChoice === "custom") return defaultCustomEndpoint.trim();
        if (defaultEndpointChoice === "preset") return defaultPresetEndpoint;
        return "";
    }, [defaultEndpointChoice, defaultPresetEndpoint, defaultCustomEndpoint]);

    useEffect(() => {
        const dtoModels: ModelRunConfig[] = models.map((model) => {
            const evaluationEndpoint =
                model.endpointChoice === "default"? null : model.endpointChoice === "preset"
                    ? (model.selectedPresetEndpoint || null)
                    : (model.customEndpoint?.trim() || null);

            return {
                label: model.label.trim() || "Model",
                evaluationEndpoint,
                llmProps: {
                    baseUrl: normalize(model.baseUrl),
                    modelName: normalize(model.modelName),
                    apiKey: normalize(model.apiKey),
                    timeoutSeconds: model.timeoutSeconds ?? null
                }
            };
        });

        const multi: MultiEvaluationRequest = {
            models: dtoModels,
            defaultEvaluationEndpoint: effectiveDefaultEndpoint,
            maxConcurrent: maxConcurrent
        };

        onMultiConfigChanged(multi);
    }, [models, effectiveDefaultEndpoint, maxConcurrent, onMultiConfigChanged]);

    function addModel() {
        setModels((prev) => [...prev, newModelRow(prev.length + 1)]);
    }

    function removeModel(id: string) {
        setModels((prev) => prev.filter((m) => m.id !== id));
    }

    function duplicateModel(id: string) {
        setModels((prev) => {
            const idx = prev.findIndex((m) => m.id === id);
            if (idx === -1) return prev;
            const src = prev[idx];
            const copy: ModelRowState = {
                ...src,
                id: cryptoRandomId(),
                label: nextLabel(src.label, prev.map((x) => x.label))
            };
            const out = [...prev];
            out.splice(idx + 1, 0, copy);
            return out;
        });
    }

    function updateModel<T extends keyof ModelRowState>(id: string, key: T, value: ModelRowState[T]) {
        setModels((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
    }

    function onClickImportYaml() {
        // @ts-ignore
        fileInputRef.current?.click()
    }

    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const parsed = yamlLoad(text) as any;
            applyYamlConfig(parsed);
        } catch (err) {
            console.error("YAML parse error:", err);
            alert("Failed to parse YAML. Please check the file.");
        } finally {
            e.target.value = ""; // allow re-upload same file
        }
    }

    function applyYamlConfig(cfg: any) {
        const defaultEvaluationEndpoint: string | undefined = cfg?.defaultEvaluationEndpoint;
        const maxConcurrent: number | undefined = cfg?.maxConcurrent ?? cfg?.maxConcurrency;
        const modelItems: any[] = Array.isArray(cfg?.models) ? cfg.models : [];

        // Default Endpoint
        if (defaultEvaluationEndpoint) {
            const presetHit = findPreset(defaultEvaluationEndpoint, availableEvaluationEndpoints);
            if (presetHit) {
                setDefaultEndpointChoice("preset");
                setDefaultPresetEndpoint(presetHit.endpoint);
            } else {
                setDefaultEndpointChoice("custom");
                setDefaultCustomEndpoint(defaultEvaluationEndpoint);
            }
        }

        if (typeof maxConcurrent === "number" && Number.isFinite(maxConcurrent) && maxConcurrent > 0) {
            setMaxConcurrent(maxConcurrent);
        }

        if (modelItems.length > 0) {
            const next: ModelRowState[] = modelItems.map((model: any, idx: number) => {
                const label = String(model?.label ?? `Model ${idx + 1}`);

                const endpoint = model?.evaluationEndpoint;
                let endpointChoice: EndpointChoice = "default";
                let selectedPresetEndpoint = "";
                let customEndpoint = "";

                if (endpoint && endpoint.trim() !== "") {
                    const preset = findPreset(endpoint, availableEvaluationEndpoints);
                    if (preset) {
                        endpointChoice = "preset";
                        selectedPresetEndpoint = preset.endpoint;
                    } else {
                        endpointChoice = "custom";
                        customEndpoint = endpoint;
                    }
                }

                const llmProps = model?.llmProps ?? {};
                const baseUrl = llmProps?.baseUrl ?? null;
                const modelName = (llmProps?.modelName ?? llmProps?.model) ?? null;

                const apiKey = llmProps?.apiKey ?? null;

                const timeoutSeconds = typeof llmProps?.timeoutSeconds === "number" ? llmProps.timeoutSeconds : null;

                return {
                    id: cryptoRandomId(),
                    label,
                    endpointChoice,
                    selectedPresetEndpoint,
                    customEndpoint,
                    baseUrl,
                    modelName,
                    apiKey,
                    timeoutSeconds
                };
            });

            setModels(next.length > 0 ? next : [newModelRow(1)]);
        }
    }

    function onClickExportYaml() {
        const req = buildCurrentRequestForExport();
        const clean = pruneNulls(req);
        const text = yamlDump(clean, { noRefs: true, lineWidth: 120, indent: 2 });

        const blob = new Blob([text], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `evaluation-config.yaml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function buildCurrentRequestForExport(): MultiEvaluationRequest {
        const dtoModels: ModelRunConfig[] = models.map((m) => {
            const evaluationEndpoint =
                m.endpointChoice === "default"
                    ? null
                    : m.endpointChoice === "preset"
                        ? m.selectedPresetEndpoint || null
                        : m.customEndpoint?.trim() || null;

            const llmProps = {
                baseUrl: normalize(m.baseUrl),
                modelName: normalize(m.modelName),
                apiKey: normalize(m.apiKey),
                timeoutSeconds: m.timeoutSeconds ?? null
            }

            return {
                label: m.label.trim() || "Model",
                evaluationEndpoint,
                llmProps: !llmProps.baseUrl && !llmProps.modelName && !llmProps.apiKey && !llmProps.timeoutSeconds ? null : llmProps
            };
        });

        return {
            defaultEvaluationEndpoint: effectiveDefaultEndpoint,
            maxConcurrent: maxConcurrent || 1,
            models: dtoModels
        };
    }


    return (
        <Card className={`w-full ${className ?? ""}`}>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>Evaluation Config (Multiple Models)</CardTitle>
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".yml,.yaml"
                        className="hidden"
                        onChange={onFileChange}
                    />
                    <Button type="button" variant="secondary" onClick={onClickImportYaml}>
                        Import YAML
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClickExportYaml}>
                        Download YAML
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <section className="space-y-3">
                    <Label>Default Evaluation Endpoint</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Select
                            value={defaultEndpointChoice}
                            onValueChange={(v: EndpointChoice) => setDefaultEndpointChoice(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Default endpoint source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="preset">Use preset</SelectItem>
                                <SelectItem value="custom">Custom URL…</SelectItem>
                            </SelectContent>
                        </Select>

                        {defaultEndpointChoice === "preset" && (
                            <Select
                                value={defaultPresetEndpoint}
                                onValueChange={setDefaultPresetEndpoint}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select preset endpoint" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableEvaluationEndpoints.map((ep) => (
                                        <SelectItem key={ep.endpoint} value={ep.endpoint}>
                                            {ep.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {defaultEndpointChoice === "custom" && (
                            <Input
                                type="text"
                                placeholder="https://example.com/analysis/v1"
                                value={defaultCustomEndpoint}
                                onChange={(e) => setDefaultCustomEndpoint(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <Label htmlFor="max-concurrent">Max Concurrent LLM Requests</Label>
                            <Input
                                id="max-concurrent"
                                type="number"
                                min={1}
                                placeholder="4"
                                value={Number.isFinite(maxConcurrent) ? maxConcurrent : ""}
                                onChange={(e) => setMaxConcurrent(safeInt(e.target.value, 4))}
                            />
                        </div>
                    </div>
                </section>

                <hr className="border-border/50" />

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Models</Label>
                        <div className="space-x-2">
                            <Button type="button" onClick={addModel}>Add model</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {models.map((model, idx) => (
                            <div key={model.id} className="rounded-2xl border p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                                        <div>
                                            <Label htmlFor={`label-${model.id}`}>Label</Label>
                                            <Input
                                                id={`label-${model.id}`}
                                                value={model.label}
                                                onChange={(e) => updateModel(model.id, "label", e.target.value)}
                                                placeholder={`Model ${idx + 1}`}
                                            />
                                        </div>

                                        <div>
                                            <Label>Endpoint</Label>
                                            <Select
                                                value={model.endpointChoice}
                                                onValueChange={(v: EndpointChoice) => updateModel(model.id, "endpointChoice", v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose endpoint source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Use default</SelectItem>
                                                    <SelectItem value="preset">Preset</SelectItem>
                                                    <SelectItem value="custom">Custom URL…</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-2 shrink-0">
                                        <Button variant="secondary" type="button" onClick={() => duplicateModel(model.id)}>Duplicate</Button>
                                        <Button variant="destructive" type="button" onClick={() => removeModel(model.id)} disabled={models.length <= 1}>
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                {(model.endpointChoice === "preset" || model.endpointChoice === "custom") && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {model.endpointChoice === "preset" && (
                                            <div>
                                                <Label>Preset Endpoint</Label>
                                                <Select
                                                    value={model.selectedPresetEndpoint}
                                                    onValueChange={(v) => updateModel(model.id, "selectedPresetEndpoint", v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select preset endpoint" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableEvaluationEndpoints.map((ep: AnalysisEndpoint) => (
                                                            <SelectItem key={ep.endpoint} value={ep.endpoint}>
                                                                {ep.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {model.endpointChoice === "custom" && (
                                            <div>
                                                <Label htmlFor={`custom-${model.id}`}>Custom Endpoint</Label>
                                                <Input
                                                    id={`custom-${model.id}`}
                                                    type="text"
                                                    placeholder="https://example.com/analysis/v1"
                                                    value={model.customEndpoint}
                                                    onChange={(e) => updateModel(model.id, "customEndpoint", e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label>LLM Base URL</Label>
                                        <Input
                                            type="text"
                                            placeholder="https://api.openai.com/v1"
                                            value={model.baseUrl || ""}
                                            onChange={(e) => updateModel(model.id, "baseUrl", emptyToNull(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label>LLM Model Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="gpt-4o-mini"
                                            value={model.modelName || ""}
                                            onChange={(e) => updateModel(model.id, "modelName", emptyToNull(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label>API Key</Label>
                                        <PasswordInput
                                            placeholder="Enter API key"
                                            value={model.apiKey || ""}
                                            onChange={(e) => updateModel(model.id, "apiKey", emptyToNull(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Label>LLM Response Timeout (seconds)</Label>
                                        <Input
                                            type="number"
                                            placeholder="240"
                                            value={model.timeoutSeconds ?? ""}
                                            onChange={(e) => updateModel(model.id, "timeoutSeconds", safeIntOrNull(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <EffectiveEndpointHint
                                    model={model}
                                    effectiveDefaultEndpoint={effectiveDefaultEndpoint}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {children}
            </CardContent>
        </Card>
    );
}

function newModelRow(index: number): ModelRowState {
    return {
        id: cryptoRandomId(),
        label: `Model ${index}`,

        endpointChoice: "default",
        selectedPresetEndpoint: "",
        customEndpoint: "",

        baseUrl: null,
        modelName: null,
        apiKey: null,
        timeoutSeconds: null
    };
}

function emptyToNull(v: string): string | null {
    const t = v.trim();
    return t === "" ? null : t;
}

function normalize<T>(v: T | null | undefined): T | null {
    return v === undefined ? null : (v as any);
}

function safeInt(input: string, fallback: number): number {
    const n = parseInt(input, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function safeIntOrNull(input: string): number | null {
    const t = input.trim();
    if (t === "") return null;
    const n = parseInt(t, 10);
    return Number.isFinite(n) ? n : null;
}

function nextLabel(base: string, existing: string[]): string {
    let i = 2;
    let candidate = `${base} (copy)`;
    while (existing.includes(candidate)) {
        candidate = `${base} (copy ${i})`;
        i++;
    }
    return candidate;
}

function cryptoRandomId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        // @ts-ignore
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
}

function findPreset(endpoint: string, presets: AnalysisEndpoint[]) {
    return presets.find((p) => p.endpoint === endpoint);
}

function pruneNulls<T>(obj: T): T {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
        // @ts-ignore
        return obj.map(pruneNulls).filter((v) => v !== null && v !== undefined) as any;
    }
    if (typeof obj === "object") {
        const out: any = {};
        Object.entries(obj as any).forEach(([k, v]) => {
            const vv = pruneNulls(v as any);
            if (vv !== null && vv !== undefined) out[k] = vv;
        });
        return out;
    }
    return obj;
}

function EffectiveEndpointHint({
   model,
   effectiveDefaultEndpoint
}: {
    model: ModelRowState;
    effectiveDefaultEndpoint: string;
}) {
    const effective =
        model.endpointChoice === "default"
            ? effectiveDefaultEndpoint || "—"
            : model.endpointChoice === "preset"
                ? model.selectedPresetEndpoint || "—"
                : model.customEndpoint?.trim() || "—";

    return (
        <div className="text-xs text-muted-foreground">
            Effective endpoint for this model: <span className="font-mono">{effective || "(unset)"}</span>
        </div>
    );
}

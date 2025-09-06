"use client";

import { useRef } from "react";
import { dump as yamlDump, load as yamlLoad } from "js-yaml";
import { MultiEvaluationRequest, ModelRunConfig } from "@/models/dto/MultiEvaluationRequest";
import {ModelRowState} from "@/models/evaluation/Config";
import {cryptoRandomId, findPreset, normalize, pruneNulls} from "@/lib/evaluation-config-utils";

export function useYamlImportExport(options: {
    availableEvaluationEndpoints: AnalysisEndpoint[];
    effectiveDefaultEndpoint: string;
    models: ModelRowState[];
    selectedDatasets: number[];
    maxConcurrent: number;
    setDefaultEndpointChoice: (v: "preset" | "custom") => void;
    setDefaultPresetEndpoint: (v: string) => void;
    setDefaultCustomEndpoint: (v: string) => void;
    setMaxConcurrent: (v: number) => void;
    setSelectedDatasets: (v: number[]) => void;
    setModels: (v: ModelRowState[]) => void;
}) {
    const {
        availableEvaluationEndpoints,
        effectiveDefaultEndpoint,
        models,
        selectedDatasets,
        maxConcurrent,
        setDefaultEndpointChoice,
        setDefaultPresetEndpoint,
        setDefaultCustomEndpoint,
        setMaxConcurrent,
        setSelectedDatasets,
        setModels,
    } = options;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function onClickImportYaml() {
        fileInputRef.current?.click();
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
            e.target.value = "";
        }
    }

    function applyYamlConfig(cfg: any) {
        const defaultEvaluationEndpoint: string | undefined = cfg?.defaultEvaluationEndpoint;
        const maxConc: number | undefined = cfg?.maxConcurrent ?? cfg?.maxConcurrency;
        const modelItems: any[] = Array.isArray(cfg?.models) ? cfg.models : [];
        const datasets: number[] = Array.isArray(cfg?.datasets) ? cfg.datasets.map((d: any) => parseInt(d)) : [];

        setSelectedDatasets(datasets);

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

        if (typeof maxConc === "number" && Number.isFinite(maxConc) && maxConc > 0) {
            setMaxConcurrent(maxConc);
        }

        if (modelItems.length > 0) {
            const next: ModelRowState[] = modelItems.map((model: any, idx: number) => {
                const label = String(model?.label ?? `Model ${idx + 1}`);

                const endpoint = model?.evaluationEndpoint;
                let endpointChoice: "default" | "preset" | "custom" = "default";
                let selectedPresetEndpoint = "";
                let customEndpoint = "";

                if (endpoint && String(endpoint).trim() !== "") {
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
                    timeoutSeconds,
                } as ModelRowState;
            });

            setModels(next.length > 0 ? next : models);
        }
    }

    function buildRequestForExport(): MultiEvaluationRequest {
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
                timeoutSeconds: m.timeoutSeconds ?? null,
            } as const;

            return {
                label: m.label.trim() || "Model",
                evaluationEndpoint,
                llmProps: !llmProps.baseUrl && !llmProps.modelName && !llmProps.apiKey && !llmProps.timeoutSeconds ? null : llmProps,
            };
        });

        return {
            defaultEvaluationEndpoint: effectiveDefaultEndpoint,
            maxConcurrent: maxConcurrent || 1,
            models: dtoModels,
            datasets: selectedDatasets,
        };
    }

    function onClickExportYaml() {
        const req = buildRequestForExport();
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

    return { fileInputRef, onClickImportYaml, onFileChange, onClickExportYaml } as const;
}
"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/input-password";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {Copy, Trash2} from "lucide-react";
import {EndpointChoice, ModelRowState} from "@/models/evaluation/Config";
import {emptyToNull, safeFloatOrNull, safeIntOrNull} from "@/lib/evaluation-config-utils";
import LlmBaseUrlDatalist from "@/components/datalist/llm-base-url-datalist";
import LlmModelNameDatalist from "@/components/datalist/llm-model-name-datalist";
import LlmApiKeyPlaceholderDatalist from "@/components/datalist/llm-api-key-placeholder-datalist";

interface EvaluationConfigModelRowProps {
    model: ModelRowState;
    index: number;
    canRemove: boolean;
    effectiveDefaultEndpoint: string;
    availableEvaluationEndpoints: AnalysisEndpoint[];
    updateModel: <T extends keyof ModelRowState>(id: string, key: T, value: ModelRowState[T]) => void;
    duplicateModel: (id: string) => void;
    removeModel: (id: string) => void;
}

export default function EvaluationConfigModelRow({model, index, canRemove, effectiveDefaultEndpoint, availableEvaluationEndpoints, updateModel, duplicateModel, removeModel }: EvaluationConfigModelRowProps) {
    return (
        <div className="space-y-4">
            {index > 0 && <Separator />}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">Model {index + 1}</Badge>
                    <span className="text-sm text-muted-foreground">
                        Effective endpoint:&nbsp;
                        {model.endpointChoice === "default"
                            ? effectiveDefaultEndpoint || "—"
                            : model.endpointChoice === "preset"
                                ? model.selectedPresetEndpoint || "—"
                                : model.customEndpoint?.trim() || "—"}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => duplicateModel(model.id)} className="gap-2 border-border text-card-foreground hover:bg-muted">
                        <Copy className="h-4 w-4" />
                        Duplicate
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeModel(model.id)} disabled={!canRemove} className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input id={`label-${model.id}`} value={model.label}
                               onChange={(e) => updateModel(model.id, "label", e.target.value)}
                               placeholder={`Model ${index + 1}`}/>
                    </div>

                    <div className="space-y-2">
                        <Label>Endpoint</Label>
                        <Select value={model.endpointChoice}
                                onValueChange={(v: EndpointChoice) => updateModel(model.id, "endpointChoice", v)}>
                            <SelectTrigger>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Use default</SelectItem>
                                <SelectItem value="preset">Preset</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {model.endpointChoice === "preset" && (
                        <div className="space-y-2">
                            <Label>Preset Endpoint</Label>
                            <Select value={model.selectedPresetEndpoint}
                                    onValueChange={(v) => updateModel(model.id, "selectedPresetEndpoint", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select preset endpoint"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <>
                                        {availableEvaluationEndpoints.map((ep) => (
                                            <SelectItem key={ep.endpoint} value={ep.endpoint}>
                                                {ep.name}
                                            </SelectItem>
                                        ))}
                                    </>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {model.endpointChoice === "custom" && (
                        <div className="space-y-2">
                            <Label>Custom Endpoint</Label>
                            <Input
                                id={`custom-${model.id}`}
                                type="text"
                                placeholder="https://example.com/analysis/v1"
                                value={model.customEndpoint}
                                onChange={(e) => updateModel(model.id, "customEndpoint", e.target.value)}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>LLM Base URL</Label>
                        <Input
                            type="text"
                            placeholder="https://api.openai.com/v1"
                            value={model.baseUrl || ""}
                            onChange={(e) => updateModel(model.id, "baseUrl", emptyToNull(e.target.value))}
                            list="llm-base-url-datalist"
                        />
                        <LlmBaseUrlDatalist id="llm-base-url-datalist"/>
                    </div>

                    <div className="space-y-2">
                        <Label>LLM Model Name</Label>
                        <Input
                            type="text"
                            placeholder="gpt-4o-mini"
                            value={model.modelName || ""}
                            onChange={(e) => updateModel(model.id, "modelName", emptyToNull(e.target.value))}
                            list="llm-model-name-datalist"
                        />
                        <LlmModelNameDatalist id="llm-model-name-datalist"/>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>API Key</Label>
                        <PasswordInput
                            placeholder="Enter API key"
                            value={model.apiKey || ""}
                            onChange={(e) => updateModel(model.id, "apiKey", emptyToNull(e.target.value))}
                            list="llm-api-key-placeholder-datalist"
                        />
                        <LlmApiKeyPlaceholderDatalist id="llm-api-key-placeholder-datalist"/>
                    </div>

                    <div className="space-y-2">
                        <Label>Temperature</Label>
                        <Input type="number" placeholder="1.0" value={model.temperature ?? ""}
                               onChange={(e) => updateModel(model.id, "temperature", safeFloatOrNull(e.target.value))}/>
                    </div>

                    <div className="space-y-2">
                        <Label>Top P</Label>
                        <Input type="number" placeholder="0.8" value={model.topP ?? ""}
                               onChange={(e) => updateModel(model.id, "topP", safeFloatOrNull(e.target.value))}/>
                    </div>

                    <div className="space-y-2">
                        <Label>LLM Response Timeout (seconds)</Label>
                        <Input type="number" placeholder="240" value={model.timeoutSeconds ?? ""}
                               onChange={(e) => updateModel(model.id, "timeoutSeconds", safeIntOrNull(e.target.value))}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
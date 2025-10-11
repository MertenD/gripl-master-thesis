"use client";

import { useEffect, useMemo, useState } from "react";
import fetchAnalysisEndpoints from "@/actions/analysis-endpoints";
import { Dataset } from "@/models/dto/Dataset";
import { ModelRunConfig, MultiEvaluationRequest } from "@/models/dto/MultiEvaluationRequest";
import {EndpointChoice, ModelRowState} from "@/models/evaluation/Config";
import {cryptoRandomId, normalize} from "@/lib/evaluation-config-utils";

export function newModelRow(index: number): ModelRowState {
    return {
        id: cryptoRandomId(),
        label: `Model ${index}`,
        endpointChoice: "default",
        selectedPresetEndpoint: "",
        customEndpoint: "",
        baseUrl: null,
        modelName: null,
        apiKey: null,
        temperature: null,
        timeoutSeconds: null,
        topP: null,
    };
}

export function useEvaluationConfig(
    datasets: Dataset[],
    onMultiConfigChanged: (config: MultiEvaluationRequest) => void
) {
    const [availableEvaluationEndpoints, setAvailableEvaluationEndpoints] = useState<AnalysisEndpoint[]>([]);

    const [defaultEndpointChoice, setDefaultEndpointChoice] = useState<EndpointChoice>("preset");
    const [defaultPresetEndpoint, setDefaultPresetEndpoint] = useState<string>("");
    const [defaultCustomEndpoint, setDefaultCustomEndpoint] = useState<string>("");
    const [seed, setSeed] = useState<number | null>(null);

    const [maxConcurrent, setMaxConcurrent] = useState<number>(4);
    const [repetitions, setRepetitions] = useState<number>(1);
    const [models, setModels] = useState<ModelRowState[]>(() => [newModelRow(1)]);
    const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);

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
                model.endpointChoice === "default"
                    ? null
                    : model.endpointChoice === "preset"
                        ? model.selectedPresetEndpoint || null
                        : model.customEndpoint?.trim() || null;

            return {
                label: model.label.trim() || "Model",
                evaluationEndpoint,
                llmProps: {
                    baseUrl: normalize(model.baseUrl),
                    modelName: normalize(model.modelName),
                    apiKey: normalize(model.apiKey),
                    temperature: model.temperature ?? null,
                    topP: model.topP ?? null,
                    timeoutSeconds: model.timeoutSeconds ?? null,
                },
            };
        });

        const multi: MultiEvaluationRequest = {
            models: dtoModels,
            datasets: selectedDatasets,
            defaultEvaluationEndpoint: effectiveDefaultEndpoint,
            seed: seed || undefined,
            maxConcurrent: maxConcurrent,
            repetitions: repetitions,
        };

        onMultiConfigChanged(multi);
    }, [models, selectedDatasets, effectiveDefaultEndpoint, seed, maxConcurrent, repetitions, onMultiConfigChanged]);

    function addModel() {
        setModels((prev) => [...prev, newModelRow(prev.length + 1)]);
    }

    function removeModel(id: string) {
        setModels((prev) => prev.filter((m) => m.id !== id));
    }

    function duplicateModel(id: string, nextLabel: (base: string, existing: string[]) => string) {
        setModels((prev) => {
            const idx = prev.findIndex((m) => m.id === id);
            if (idx === -1) return prev;
            const src = prev[idx];
            const copy: ModelRowState = {
                ...src,
                id: cryptoRandomId(),
                label: nextLabel(src.label, prev.map((x) => x.label)),
            };
            const out = [...prev];
            out.splice(idx + 1, 0, copy);
            return out;
        });
    }

    function updateModel<T extends keyof ModelRowState>(id: string, key: T, value: ModelRowState[T]) {
        setModels((prev) => prev.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
    }

    return {
        availableEvaluationEndpoints,
        defaultEndpointChoice,
        defaultPresetEndpoint,
        defaultCustomEndpoint,
        seed,
        maxConcurrent,
        repetitions,
        models,
        selectedDatasets,
        effectiveDefaultEndpoint,
        setDefaultEndpointChoice,
        setDefaultPresetEndpoint,
        setDefaultCustomEndpoint,
        setSeed,
        setMaxConcurrent,
        setRepetitions,
        setSelectedDatasets,
        setModels,
        addModel,
        removeModel,
        duplicateModel,
        updateModel,
    } as const;
}

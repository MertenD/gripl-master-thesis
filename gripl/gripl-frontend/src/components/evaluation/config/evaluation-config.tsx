"use client";

import React, { JSX } from "react";
import {Dataset} from "@/models/dto/Dataset";
import {MultiEvaluationRequest} from "@/models/dto/MultiEvaluationRequest";
import {useEvaluationConfig} from "@/hooks/evaluation/use-evaluation-config";
import {useYamlImportExport} from "@/hooks/evaluation/use-yaml-import-export";
import EvaluationConfigHeader from "@/components/evaluation/config/evaluation-config-header";
import EvaluationConfigDefaultSettings from "@/components/evaluation/config/evaluation-config-default-settings";
import EvaluationConfigDatasetSettings from "@/components/evaluation/config/evaluation-config-dataset-settings";
import EvaluationConfigModelsSettings from "@/components/evaluation/config/evaluation-config-models-settings";
import {nextLabel} from "@/lib/evaluation-config-utils";

interface EvaluationConfigCardMultiProps {
    className?: string;
    children?: JSX.Element;
    datasets: Dataset[];
    onMultiConfigChanged: (config: MultiEvaluationRequest) => void;
}

export default function EvaluationConfig({ className, children, datasets, onMultiConfigChanged }: EvaluationConfigCardMultiProps) {
    const config = useEvaluationConfig(datasets, onMultiConfigChanged);

    const { fileInputRef, onClickImportYaml, onFileChange, onClickExportYaml } = useYamlImportExport({
        availableEvaluationEndpoints: config.availableEvaluationEndpoints,
        effectiveDefaultEndpoint: config.effectiveDefaultEndpoint,
        models: config.models,
        selectedDatasets: config.selectedDatasets,
        seed: config.seed,
        maxConcurrent: config.maxConcurrent,
        repetitions: config.repetitions,
        setDefaultEndpointChoice: (v) => config.setDefaultEndpointChoice(v),
        setDefaultPresetEndpoint: config.setDefaultPresetEndpoint,
        setDefaultCustomEndpoint: config.setDefaultCustomEndpoint,
        setSeed: config.setSeed,
        setMaxConcurrent: config.setMaxConcurrent,
        setRepetitions: config.setRepetitions,
        setSelectedDatasets: config.setSelectedDatasets,
        setModels: config.setModels,
    });

    return (
        <div className={`bg-background dark ${className ?? ""}`}>
            <div className="border-b border-border bg-card">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-card-foreground">Evaluation Config</h1>
                            <p className="text-sm text-muted-foreground mt-1">Multiple Models</p>
                        </div>
                        <EvaluationConfigHeader
                            fileInputRef={fileInputRef}
                            onFileChange={onFileChange}
                            onClickImportYaml={onClickImportYaml}
                            onClickExportYaml={onClickExportYaml}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <EvaluationConfigDefaultSettings
                        availableEvaluationEndpoints={config.availableEvaluationEndpoints}
                        defaultEndpointChoice={config.defaultEndpointChoice}
                        defaultPresetEndpoint={config.defaultPresetEndpoint}
                        defaultCustomEndpoint={config.defaultCustomEndpoint}
                        seed={config.seed}
                        maxConcurrent={config.maxConcurrent}
                        repetitions={config.repetitions}
                        setDefaultEndpointChoice={config.setDefaultEndpointChoice}
                        setDefaultPresetEndpoint={config.setDefaultPresetEndpoint}
                        setDefaultCustomEndpoint={config.setDefaultCustomEndpoint}
                        setSeed={config.setSeed}
                        onMaxConcurrentChange={(v) => config.setMaxConcurrent(v)}
                        onRepetitionsChange={(v) => config.setRepetitions(v)}
                    />

                    <EvaluationConfigDatasetSettings
                        datasets={datasets}
                        selectedDatasets={config.selectedDatasets}
                        onChange={config.setSelectedDatasets}
                    />
                </div>

                <EvaluationConfigModelsSettings
                    models={config.models}
                    effectiveDefaultEndpoint={config.effectiveDefaultEndpoint}
                    availableEvaluationEndpoints={config.availableEvaluationEndpoints}
                    addModel={config.addModel}
                    updateModel={config.updateModel}
                    duplicateModel={(id) => config.duplicateModel(id, nextLabel)}
                    removeModel={config.removeModel}
                />

                {children}
            </div>
        </div>
    );
}

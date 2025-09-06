"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {ModelRowState} from "@/models/evaluation/Config";
import EvaluationConfigModelRow from "@/components/evaluation/config/evaluation-config-model-row";

interface EvaluationConfigModelsSettingsProps {
    models: ModelRowState[];
    effectiveDefaultEndpoint: string;
    availableEvaluationEndpoints: AnalysisEndpoint[];
    addModel: () => void;
    updateModel: <T extends keyof ModelRowState>(id: string, key: T, value: ModelRowState[T]) => void;
    duplicateModel: (id: string) => void;
    removeModel: (id: string) => void;
}

export default function EvaluationConfigModelsSettings({ models, effectiveDefaultEndpoint, availableEvaluationEndpoints, addModel, updateModel, duplicateModel, removeModel }: EvaluationConfigModelsSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Models Configuration</CardTitle>
                    <Button onClick={addModel} size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Model
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {models.map((model, index) => (
                    <EvaluationConfigModelRow
                        key={model.id}
                        model={model}
                        index={index}
                        canRemove={models.length > 1}
                        effectiveDefaultEndpoint={effectiveDefaultEndpoint}
                        availableEvaluationEndpoints={availableEvaluationEndpoints}
                        updateModel={updateModel}
                        duplicateModel={duplicateModel}
                        removeModel={removeModel}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
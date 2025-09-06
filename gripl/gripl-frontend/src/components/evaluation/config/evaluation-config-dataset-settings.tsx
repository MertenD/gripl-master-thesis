"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Dataset } from "@/models/dto/Dataset";

interface EvaluationConfigDatasetSettingsProps {
    datasets: Dataset[];
    selectedDatasets: number[];
    onChange: (ids: number[]) => void;
}

export default function EvaluationConfigDatasetSettings({ datasets, selectedDatasets, onChange }: EvaluationConfigDatasetSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Datasets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Label>Select Datasets</Label>
                    <MultiSelect
                        defaultValue={selectedDatasets.map((id) => id.toString())}
                        options={datasets.map((dataset) => ({ label: dataset.name, value: dataset.id.toString() }))}
                        onValueChange={(newDatasets) => onChange(newDatasets.map((id) => parseInt(id)))}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
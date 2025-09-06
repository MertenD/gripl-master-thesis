"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {EndpointChoice} from "@/models/evaluation/Config";

interface EvaluationConfigDefaultSettingsProps {
    availableEvaluationEndpoints: AnalysisEndpoint[];
    defaultEndpointChoice: EndpointChoice;
    defaultPresetEndpoint: string;
    defaultCustomEndpoint: string;
    maxConcurrent: number;
    setDefaultEndpointChoice: (v: EndpointChoice) => void;
    setDefaultPresetEndpoint: (v: string) => void;
    setDefaultCustomEndpoint: (v: string) => void;
    onMaxConcurrentChange: (v: number) => void;
}

export default function EvaluationConfigDefaultSettings(props: EvaluationConfigDefaultSettingsProps) {
    const {
        availableEvaluationEndpoints,
        defaultEndpointChoice,
        defaultPresetEndpoint,
        defaultCustomEndpoint,
        maxConcurrent,
        setDefaultEndpointChoice,
        setDefaultPresetEndpoint,
        setDefaultCustomEndpoint,
        onMaxConcurrentChange,
    } = props;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Default Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Default Evaluation Endpoint</Label>
                    <Select value={defaultEndpointChoice} onValueChange={(v: EndpointChoice) => setDefaultEndpointChoice(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="preset">Use preset</SelectItem>
                            <SelectItem value="custom">Custom endpoint</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {defaultEndpointChoice === "preset" && (
                    <div className="space-y-2">
                        <Label>Preset Endpoint</Label>
                        <Select value={defaultPresetEndpoint} onValueChange={setDefaultPresetEndpoint}>
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
                    </div>
                )}

                {defaultEndpointChoice === "custom" && (
                    <div className="space-y-2">
                        <Label>Custom Endpoint</Label>
                        <Input type="text" placeholder="https://example.com/analysis/v1" value={defaultCustomEndpoint} onChange={(e) => setDefaultCustomEndpoint(e.target.value)} />
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Max Concurrent LLM Requests</Label>
                    <Input id="max-requests" type="number" min={1} placeholder="4" value={Number.isFinite(maxConcurrent) ? maxConcurrent : ""} onChange={(e) => onMaxConcurrentChange(parseInt(e.target.value, 10) || 1)} className="w-full" />
                </div>
            </CardContent>
        </Card>
    );
}
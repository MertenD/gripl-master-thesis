"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import React, {useEffect, useState} from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import fetchAnalysisEndpoints from "@/actions/analysis-endpoints";
import {PasswordInput} from "@/components/ui/input-password";
import {EvaluationRequest} from "@/models/dto/EvaluationRequest";

interface EvaluationConfigCardProps {
    children?: React.ReactNode,
    onEvaluationConfigChanged: (evaluationConfig: EvaluationRequest) => void
    className?: string
}

export default function EvaluationConfigCard({ children, onEvaluationConfigChanged, className }: EvaluationConfigCardProps) {
    const [selectedEvaluationEndpoint, setSelectedEvaluationEndpoint] = useState<string>("")
    const [customEvaluationEndpoint, setCustomEvaluationEndpoint] = useState<string>("")
    const [isCustom, setIsCustom] = useState<boolean>(false)
    const [availableEvaluationEndpoints, setAvailableEvaluationEndpoints] = useState<AnalysisEndpoint[]>([])

    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const [modelName, setModelName] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [llmResponseTimeoutSeconds, setLlmResponseTimeoutSeconds] = useState<number | null>(null);

    useEffect(() => {
        fetchAnalysisEndpoints().then((endpoints => {
            setAvailableEvaluationEndpoints(endpoints)
            setSelectedEvaluationEndpoint(endpoints.length > 0 ? endpoints[0].endpoint : "")
        }))
    }, []);

    function handleSelectChange(value: string) {
        if (value === "custom") {
            setIsCustom(true)
            setSelectedEvaluationEndpoint("")
        } else {
            setIsCustom(false)
            setSelectedEvaluationEndpoint(value)
        }
    }

    useEffect(() => {
        let evaluationEndpoint = null
        if (isCustom && customEvaluationEndpoint) {
            evaluationEndpoint = customEvaluationEndpoint.trim();
        } else if (!isCustom && selectedEvaluationEndpoint) {
            const selectedEndpoint = availableEvaluationEndpoints.find(ep => ep.endpoint === selectedEvaluationEndpoint);
            if (selectedEndpoint) {
                evaluationEndpoint = selectedEndpoint.endpoint
            }
        }
        onEvaluationConfigChanged({
            evaluationEndpoint: evaluationEndpoint,
            llmProps: {
                baseUrl: baseUrl,
                modelName: modelName,
                apiKey: apiKey,
                timeoutSeconds: llmResponseTimeoutSeconds
            }
        })
    }, [isCustom, customEvaluationEndpoint, selectedEvaluationEndpoint, baseUrl, modelName, apiKey, llmResponseTimeoutSeconds]);

    return <Card className={`w-full ${className}`}>
        <CardHeader>
            <CardTitle>Evaluation Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="evaluation-method">Evaluation Method {availableEvaluationEndpoints.length === 0 && "(No preconfigured methods available)"}</Label>
                <Select onValueChange={handleSelectChange} value={isCustom ? "custom" : selectedEvaluationEndpoint}>
                    <SelectTrigger className="w-full" id="evaluation-method">
                        <SelectValue placeholder="Select Evaluation Method" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableEvaluationEndpoints.map((endpoint) => (
                            <SelectItem key={endpoint.endpoint} value={endpoint.endpoint}>
                                {endpoint.name}
                            </SelectItem>
                        ))}
                        <SelectItem value="custom">Add custom endpoint...</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {!isCustom && selectedEvaluationEndpoint != "" && <>
                <div>
                    <Label htmlFor="model-name">LLM Base Url</Label>
                    <Input
                        id="base-url"
                        type="text"
                        placeholder="https://api.openai.com/v1"
                        value={baseUrl || ""}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            setBaseUrl(value === "" ? null : value);
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="model-name">LLM Model Name</Label>
                    <Input
                        id="model-name"
                        type="text"
                        placeholder="gpt-3.5-turbo"
                        value={modelName || ""}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            setModelName(value === "" ? null : value);
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <PasswordInput
                        id="api-key"
                        placeholder="Enter your API key"
                        value={apiKey || ""}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            setApiKey(value === "" ? null : value);
                        }}
                    />
                </div>
                <div>
                    <Label htmlFor="timeout-seconds">LLM Response Timeout (seconds)</Label>
                    <Input
                        id="timeout-seconds"
                        type="number"
                        placeholder="60"
                        value={llmResponseTimeoutSeconds !== null ? llmResponseTimeoutSeconds : ""}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            setLlmResponseTimeoutSeconds(value === "" ? null : parseInt(value, 10));
                        }}
                    />
                </div>
            </>}

            {isCustom && (
                <div>
                    <Label htmlFor="custom-endpoint">Custom Endpoint</Label>
                    <Input
                        id="custom-endpoint"
                        type="text"
                        placeholder="Enter custom endpoint (e.g., https://www.example.com/evaluation)"
                        value={customEvaluationEndpoint}
                        onChange={(e) => setCustomEvaluationEndpoint(e.target.value)}
                    />
                </div>
            )}

            { children }
        </CardContent>
    </Card>
}

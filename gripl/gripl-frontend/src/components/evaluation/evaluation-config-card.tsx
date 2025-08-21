"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import React, {useEffect, useState} from "react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import fetchAnalysisEndpoints from "@/actions/analysis-endpoints";

interface EvaluationConfigCardProps {
    children?: React.ReactNode,
    onEndpointChange: (endpoint: string) => void
    className?: string
}

export default function EvaluationConfigCard({ children, onEndpointChange, className }: EvaluationConfigCardProps) {
    const [selectedValue, setSelectedValue] = useState<string>("")
    const [customValue, setCustomValue] = useState<string>("")
    const [isCustom, setIsCustom] = useState<boolean>(false)
    const [availableEvaluationEndpoints, setAvailableEvaluationEndpoints] = useState<AnalysisEndpoint[]>([])

    useEffect(() => {
        fetchAnalysisEndpoints().then((endpoints => {
            setAvailableEvaluationEndpoints(endpoints)
        }))
    }, []);

    function handleSelectChange(value: string) {
        if (value === "custom") {
            setIsCustom(true)
            setSelectedValue("")
        } else {
            setIsCustom(false)
            setSelectedValue(value)
        }
    }

    useEffect(() => {
        if (isCustom && customValue) {
            onEndpointChange(customValue)
        } else if (!isCustom && selectedValue) {
            const selectedEndpoint = availableEvaluationEndpoints.find(ep => ep.endpoint === selectedValue);
            if (selectedEndpoint) {
                onEndpointChange(selectedEndpoint.endpoint);
            }
        }
    })

    return <Card className={`w-full ${className}`}>
        <CardHeader>
            <CardTitle>Evaluation Config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="evaluation-method">Evaluation Method {availableEvaluationEndpoints.length === 0 && "(No preconfigured methods available)"}</Label>
                <Select onValueChange={handleSelectChange} value={isCustom ? "custom" : selectedValue}>
                    <SelectTrigger id="evaluation-method">
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

            {isCustom && (
                <div>
                    <Label htmlFor="custom-endpoint">Custom Endpoint</Label>
                    <Input
                        id="custom-endpoint"
                        type="text"
                        placeholder="Enter custom endpoint (e.g., https://www.example.com/evaluation)"
                        value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                    />
                </div>
            )}

            { children }
        </CardContent>
    </Card>
}

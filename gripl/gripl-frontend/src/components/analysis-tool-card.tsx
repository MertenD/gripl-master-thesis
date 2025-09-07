"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FileText, RefreshCw} from "lucide-react";
import {useState} from "react";
import {AnalysisResponse} from "@/models/dto/AnalysisDto";
import {isLocalURL} from "next/dist/shared/lib/router/utils/is-local-url";
import {Spinner} from "@/components/ui/spinner";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/input-password";
import {Separator} from "@/components/ui/separator";
import {LlmPropsOverride} from "@/models/dto/MultiEvaluationRequest";
import LlmBaseUrlDatalist from "@/components/datalist/llm-base-url-datalist";
import LlmModelNameDatalist from "@/components/datalist/llm-model-name-datalist";
import LlmApiKeyPlaceholderDatalist from "@/components/datalist/llm-api-key-placeholder-datalist";
import {time} from "html2canvas/dist/types/css/types/time";

interface AnalysisToolCardProps {
    bpmnXml: string;
    analysisResult: AnalysisResponse | null;
    setAnalysisResult: (result: AnalysisResponse | null) => void;
}

export default function AnalysisToolCard({ bpmnXml, analysisResult, setAnalysisResult }: AnalysisToolCardProps) {

    const [llmBaseUrl, setLlmBaseUrl] = useState<string>("")
    const [modelName, setModelName] = useState<string>("")
    const [apiKey, setApiKey] = useState<string>("")
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    function handleAnalyzeClick() {
        setAnalysisResult(null);
        setIsAnalyzing(true);

        const xmlBlob = new Blob([bpmnXml], { type: "application/xml" });
        const formData = new FormData();
        formData.append("bpmnFile", xmlBlob, "diagram.bpmn");

        const llmProps = {
            baseUrl: llmBaseUrl || null,
            modelName: modelName || null,
            apiKey: apiKey || null
        } as LlmPropsOverride
        const jsonBlob = new Blob([JSON.stringify(llmProps)], { type: "application/json" });
        formData.append("llmProps", jsonBlob);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 240000);

        fetch(`/api/gdpr/analysis/v1`, {
            method: "POST",
            headers: {
                Accept: "application/json"
            },
            body: formData,
            signal: controller.signal
        } as RequestInit).then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error("Fehler bei der Analyse des Diagramms");
            }
            return response.json();
        }).then((data: AnalysisResponse) => {
            console.log("Analyse abgeschlossen:", data);
            setIsAnalyzing(false);
            setAnalysisResult(data);
        }).catch(error => {
            clearTimeout(timeoutId)
            console.error("Fehler bei der Analyse:", error);
            setIsAnalyzing(false);
            alert("Fehler bei der Analyse des Diagramms: " + error.message);
        })
    }

    return <Card className="max-w-80">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">GRIPL Analysis Tool</CardTitle>
            <CardDescription>Analyze the given BPMN diagram for GDPR compliance using the specified LLM. Critical elements will be highlighted in the diagram.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <div className="space-y-2">
                <Label>LLM Base URL</Label>
                <Input
                    type="text"
                    className="w-full"
                    placeholder="https://api.openai.com/v1"
                    value={llmBaseUrl}
                    onChange={(e) => setLlmBaseUrl(e.target.value)}
                    list="llm-base-urls"
                />
                <LlmBaseUrlDatalist id="llm-base-urls"/>
            </div>
            <div className="space-y-2">
                <Label>Model Name</Label>
                <Input
                    type="text"
                    className="w-full"
                    placeholder="gpt-3.5-turbo-0125"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    list="llm-model-names"
                />
                <LlmModelNameDatalist id="llm-model-names" />
            </div>
            <div className="space-y-2">
                <Label>API Key</Label>
                <PasswordInput
                    className="w-full"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    list="llm-api-key-placeholders"
                />
                <LlmApiKeyPlaceholderDatalist id="llm-api-key-placeholders" />
            </div>
            <Separator />
            <Button
                onClick={handleAnalyzeClick}
                variant="default"
                disabled={isAnalyzing || !bpmnXml}
            >
                { isAnalyzing ? <>
                    <Spinner className="text-white mr-2 h-4 w-4" />
                    <span>Analyzing...</span>
                </> : <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze for GDPR
                </> }
            </Button>
            <Button
                onClick={() => setAnalysisResult(null)}
                variant="outline"
                disabled={!analysisResult || analysisResult?.relevantElements.length === 0 || isAnalyzing}
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Analysis Results
            </Button>
        </CardContent>
    </Card>
}
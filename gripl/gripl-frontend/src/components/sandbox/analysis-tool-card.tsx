"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Download, FileText, RefreshCw} from "lucide-react";
import {useState} from "react";
import {AnalysisResponse} from "@/models/dto/AnalysisDto";
import {Spinner} from "@/components/ui/spinner";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/input-password";
import {Separator} from "@/components/ui/separator";
import {LlmPropsOverride} from "@/models/dto/MultiEvaluationRequest";
import LlmBaseUrlDatalist from "@/components/datalist/llm-base-url-datalist";
import LlmModelNameDatalist from "@/components/datalist/llm-model-name-datalist";
import LlmApiKeyPlaceholderDatalist from "@/components/datalist/llm-api-key-placeholder-datalist";
import {GenerateRandomInput} from "@/components/ui/input-generate-random";
import {safeFloatOrNull} from "@/lib/evaluation-config-utils";

interface AnalysisToolCardProps {
    bpmnXml: string;
    analysisResult: AnalysisResponse | null;
    setAnalysisResult: (result: AnalysisResponse | null) => void;
}

export default function AnalysisToolCard({ bpmnXml, analysisResult, setAnalysisResult }: AnalysisToolCardProps) {

    const [llmBaseUrl, setLlmBaseUrl] = useState<string>("")
    const [modelName, setModelName] = useState<string>("")
    const [apiKey, setApiKey] = useState<string>("")
    const [seed, setSeed] = useState<number | null>(null)
    const [temperature, setTemperature] = useState<number | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

    function handleAnalyzeClick() {
        setAnalysisResult(null);
        setIsAnalyzing(true);

        const xmlBlob = new Blob([bpmnXml], { type: "application/xml" });
        const formData = new FormData();
        formData.append("bpmnFile", xmlBlob, "diagram.bpmn");

        const llmProps = {
            baseUrl: llmBaseUrl || null,
            modelName: modelName || null,
            apiKey: apiKey || null,
            seed: seed || null,
            temperature: temperature || null,
        } as LlmPropsOverride
        const jsonBlob = new Blob([JSON.stringify(llmProps)], { type: "application/json" });
        formData.append("llmProps", jsonBlob);

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/analysis/prompt-engineering`, {
            method: "POST",
            headers: {
                Accept: "application/json"
            },
            body: formData
        } as RequestInit).then(response => {
            if (!response.ok) {
                throw new Error("Fehler bei der Analyse des Diagramms");
            }
            return response.json();
        }).then((data: AnalysisResponse) => {
            console.log("Analyse abgeschlossen:", data);
            setIsAnalyzing(false);
            setAnalysisResult(data);
        }).catch(error => {
            console.error("Fehler bei der Analyse:", error);
            setIsAnalyzing(false);
            alert("Fehler bei der Analyse des Diagramms: " + error.message);
        })
    }

    function handleDownloadResultClick() {
        if (!analysisResult) return;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "gripl-analysis-result.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    return <Card className="max-w-80">
        <CardHeader>
            <CardTitle className="text-lg font-semibold">GRIPL Analysis Tool</CardTitle>
            <CardDescription>Analyze the given BPMN diagram for GDPR compliance using the specified LLM. Critical elements will be highlighted in the diagram.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-2">
            <div className="space-y-1">
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
            <div className="space-y-1">
                <Label>Model Name</Label>
                <Input
                    type="text"
                    className="w-full"
                    placeholder="gpt-3.5-turbo-0125"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    list="llm-model-names"
                />
                <LlmModelNameDatalist id="llm-model-names"/>
            </div>
            <div className="space-y-1">
                <Label>API Key</Label>
                <PasswordInput
                    className="w-full"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    list="llm-api-key-placeholders"
                />
                <LlmApiKeyPlaceholderDatalist id="llm-api-key-placeholders"/>
            </div>
            <div className="space-y-1">
                <Label>Seed</Label>
                <GenerateRandomInput id="seed" placeholder="Seed for reproducibility"
                                     length={8}
                                     value={seed || ""}
                                     alphabet={"0123456789"}
                                     onChange={(e) => setSeed(parseInt(e.target.value))}
                                     className="w-full"/>
            </div>
            <div className="space-y-2">
                <Label>Temperature</Label>
                <Input type="number" placeholder="1.0" value={temperature ?? ""}
                       onChange={(e) => setTemperature(safeFloatOrNull(e.target.value))}/>
            </div>
            <div className="py-2">
                <Separator/>
            </div>
            <Button
                onClick={handleAnalyzeClick}
                variant="default"
                disabled={isAnalyzing || !bpmnXml}
            >
                <>{isAnalyzing ? <>
                    <Spinner className="text-white mr-2 h-4 w-4"/>
                    <span>Analyzing...</span>
                </> : <>
                    <FileText className="mr-2 h-4 w-4"/>
                    Analyze for GDPR
                </>}</>
            </Button>
            <Button
                onClick={handleDownloadResultClick}
                variant="outline"
                disabled={!analysisResult || analysisResult.criticalElements.length === 0 || isAnalyzing}
            >
                <Download className="mr-2 h-4 w-4"/>
                Download Report (Json)
            </Button>
            <Button
                onClick={() => setAnalysisResult(null)}
                variant="outline"
                disabled={!analysisResult || analysisResult.criticalElements.length === 0 || isAnalyzing}
            >
                <RefreshCw className="mr-2 h-4 w-4"/>
                Clear Analysis Results
            </Button>
        </CardContent>
    </Card>
}
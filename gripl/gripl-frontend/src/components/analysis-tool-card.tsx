"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FileText, RefreshCw} from "lucide-react";
import {useState} from "react";
import {AnalysisRequest, AnalysisResponse} from "@/models/dto/AnalysisDto";

interface AnalysisToolCardProps {
    bpmnXml: string;
    highlightedActivityIds?: string[];
    setHighlightedActivityIds?: (ids: string[]) => void;
}

export default function AnalysisToolCard({ bpmnXml, highlightedActivityIds, setHighlightedActivityIds }: AnalysisToolCardProps) {

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    function handleAnalyzeClick() {
        setHighlightedActivityIds && setHighlightedActivityIds([]);
        setIsAnalyzing(true);

        const xmlBlob = new Blob([bpmnXml], { type: "application/xml" });
        const formData = new FormData();
        formData.append("bpmnFile", xmlBlob, "diagram.bpmn");

        fetch(`/api/gdpr/analysis`, {
            method: "POST",
            headers: {
                Accept: "application/json"
            },
            body: formData,
        }).then(response => {
            if (!response.ok) {
                throw new Error("Fehler bei der Analyse des Diagramms");
            }
            return response.json();
        }).then((data: AnalysisResponse) => {
            console.log("Analyse abgeschlossen:", data);
            setIsAnalyzing(false);
            if (setHighlightedActivityIds) {
                setHighlightedActivityIds(data.relevantElements.map(e => e.id) || []);
            }
        }).catch(error => {
            console.error("Fehler bei der Analyse:", error);
            setIsAnalyzing(false);
            alert("Fehler bei der Analyse des Diagramms: " + error.message);
        })
    }

    return <Card>
        <CardHeader>
            <h2 className="text-lg font-semibold">GRIPL Analysetools</h2>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <Button
                onClick={handleAnalyzeClick}
                variant="default"
                disabled={isAnalyzing || !bpmnXml}
            >
                <FileText className="mr-2 h-4 w-4" />
                Datenschutz analysieren
            </Button>
            <Button
                onClick={() => setHighlightedActivityIds && setHighlightedActivityIds([])}
                variant="outline"
                disabled={!highlightedActivityIds || highlightedActivityIds.length === 0 || isAnalyzing}
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Hervorhebungen zurücksetzen
            </Button>
        </CardContent>
    </Card>
}
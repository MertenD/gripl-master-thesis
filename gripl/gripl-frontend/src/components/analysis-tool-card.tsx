"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FileText, RefreshCw} from "lucide-react";
import {useState} from "react";

interface AnalysisToolCardProps {
    bpmnXml: string;
    highlightedActivityIds?: string[];
    setHighlightedActivityIds?: (ids: string[]) => void;
}

export default function AnalysisToolCard({ bpmnXml, highlightedActivityIds, setHighlightedActivityIds }: AnalysisToolCardProps) {

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    function analyzeDiagram() {
        setHighlightedActivityIds && setHighlightedActivityIds([]);
        setIsAnalyzing(true);

        fetch(`/api/gdpr/analysis`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bpmnXml: bpmnXml,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error("Fehler bei der Analyse des Diagramms");
            }
            return response.json();
        }).then(data => {
            console.log("Analyse abgeschlossen:", data);
            setIsAnalyzing(false);
            if (setHighlightedActivityIds) {
                setHighlightedActivityIds(data || []);
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
                onClick={analyzeDiagram}
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
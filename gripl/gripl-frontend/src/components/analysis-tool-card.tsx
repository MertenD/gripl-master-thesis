import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FileText, RefreshCw} from "lucide-react";

interface AnalysisToolCardProps {
    bpmnXml: string;
}

export default function AnalysisToolCard({ bpmnXml }: AnalysisToolCardProps) {

    return <Card>
        <CardHeader>
            <h2 className="text-lg font-semibold">GRIPL Analysetools</h2>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <Button
                onClick={console.log.bind(console, "Diagramm exportieren")}
                variant="default"
            >
                <FileText className="mr-2 h-4 w-4" />
                Datenschutz analysieren
            </Button>
            <Button
                onClick={() => console.log("Hervorhebungen zurücksetzen")}
                variant="outline"
            >
                <RefreshCw className="mr-2 h-4 w-4" />
                Hervorhebungen zurücksetzen
            </Button>
        </CardContent>
    </Card>
}
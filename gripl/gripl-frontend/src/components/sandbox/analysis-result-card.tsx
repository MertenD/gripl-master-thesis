import {AnalysisResponse} from "@/models/dto/AnalysisDto";
import {Brain} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface AnalysisResultCardProps {
    analysisResult: AnalysisResponse | null,
    selectedElementId?: string | null
}

export default function AnalysisResultCard({ analysisResult, selectedElementId }: AnalysisResultCardProps) {

    return analysisResult && <Card className="max-w-[900px]">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Model Reasoning
            </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
                <thead>
                <tr className="bg-muted">
                    <th className="text-left text-sm font-semibold p-2">Activity</th>
                    <th className="text-left text-sm font-semibold p-2">Reasoning</th>
                </tr>
                </thead>
                <tbody>
                {analysisResult.criticalElements.map((element, index) => {
                    const isSelected = element.id === selectedElementId
                    return <tr key={index} className={`border-t ${isSelected ? "bg-primary/20" : ""}`}>
                        <td className="font-medium text-sm mb-1 p-2">{element.name}</td>
                        <td className="text-sm p-2">{element.reason || "No reasoning provided"}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </CardContent>
    </Card>
}
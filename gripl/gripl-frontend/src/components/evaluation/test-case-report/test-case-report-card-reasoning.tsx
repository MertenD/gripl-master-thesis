import {Brain} from "lucide-react";
import {TestCaseReport} from "@/models/dto/ReportData";

interface TestCaseReportCardReasoningProps {
    report: TestCaseReport
}

export default function TestCaseReportCardReasoning({ report }: TestCaseReportCardReasoningProps) {

    return report.result && report.result.length > 0 && <div>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Model Reasoning
        </h3>
        <div className="rounded-lg border">
            <table className="w-full">
                <thead>
                    <tr className="bg-muted">
                        <th className="text-left text-sm font-semibold p-2">Activity</th>
                        <th className="text-left text-sm font-semibold p-2">Reasoning</th>
                    </tr>
                </thead>
                <tbody>
                    {report.result.map((result, index) => {
                        const matchedName =
                            report.actualNamesWithIds.find((nameWithId) => nameWithId.includes(result.value)) ||
                            result.value

                        const isFalsePositive = report.falsePositiveIds?.includes(result.value) || false

                        return <tr key={index} className={`border-t ${isFalsePositive && "bg-destructive/30"}`}>
                            <td className="font-medium text-sm mb-1 p-2">{matchedName}</td>
                            <td className="text-sm p-2">{result.reason || "No reasoning provided"}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    </div>
}
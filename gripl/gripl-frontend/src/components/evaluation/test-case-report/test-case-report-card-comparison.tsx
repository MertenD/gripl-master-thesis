import {ListChecks, Target} from "lucide-react";
import {Card} from "@/components/ui/card";
import {TestCaseReport} from "@/models/dto/ReportData";

interface TestCaseReportCardComparisonProps {
    report: TestCaseReport
}

export default function TestCaseReportCardComparison({ report }: TestCaseReportCardComparisonProps) {

    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Expected Activities
            </h3>
            <Card className="p-3">
                <div className="space-y-1">
                    {report.expectedNamesWithIds.map((item, index) => {
                        const isCorrect = report.correctActivityIds?.some(id => item.includes(`(${id})`))
                        return <div key={index} className={`text-sm ${isCorrect ? 'text-chart-success' : 'text-warning'}`}>
                            • {item}
                        </div>
                    })}
                </div>
            </Card>
        </div>

        <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                Detected Activities
            </h3>
            <Card className="p-3">
                <div className="space-y-1">
                    {report.actualNamesWithIds.map((item, index) => {
                        const isCorrect = report.correctActivityIds?.some(id => item.includes(`(${id})`))
                        return <div key={index} className={`text-sm ${isCorrect ? 'text-chart-success' : 'text-destructive'}`}>
                            • {item}
                        </div>
                    })}
                </div>
            </Card>
        </div>
    </div>
}
import {XCircle} from "lucide-react";
import {Card} from "@/components/ui/card";
import {TestCaseReport} from "@/models/dto/ReportData";

interface TestCaseReportCardErrorAnalysisProps {
    report: TestCaseReport
}

export default function TestCaseReportCardErrorAnalysis({ report }: TestCaseReportCardErrorAnalysisProps) {

    const falsePositiveCount = report.falsePositiveIds?.length || 0
    const falseNegativeCount = report.falseNegativeIds?.length || 0

    const getFalsePositiveNames = () => {
        if (!report.falsePositiveIds) return []
        return report.falsePositiveIds.map((id) => {
            const found = report.actualNamesWithIds.find((nameWithId) => nameWithId.includes(`(${id})`))
            return found || `Activity ${id}`
        })
    }

    const getFalseNegativeNames = () => {
        if (!report.falseNegativeIds) return []
        return report.falseNegativeIds.map((id) => {
            const found = report.expectedNamesWithIds.find((nameWithId) => nameWithId.includes(`(${id})`))
            return found || `Activity ${id}`
        })
    }

    const falsePositiveNames = getFalsePositiveNames()
    const falseNegativeNames = getFalseNegativeNames()

    return !report.isSuccessful && (falsePositiveCount > 0 || falseNegativeCount > 0) && <div>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Error Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {falsePositiveCount > 0 && (
                <Card className="p-3 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                    <h4 className="font-medium text-sm text-orange-700 dark:text-orange-300 mb-2">
                        False Positives ({falsePositiveCount})
                    </h4>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
                        Activities detected but not expected
                    </p>
                    <div className="space-y-1">
                        {falsePositiveNames.map((name, index) => (
                            <div
                                key={index}
                                className="text-xs text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded"
                            >
                                • {name}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
            {falseNegativeCount > 0 && (
                <Card className="p-3 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                    <h4 className="font-medium text-sm text-red-700 dark:text-red-300 mb-2">
                        False Negatives ({falseNegativeCount})
                    </h4>
                    <p className="text-xs text-red-600 dark:text-red-400 mb-3">
                        Expected activities not detected
                    </p>
                    <div className="space-y-1">
                        {falseNegativeNames.map((name, index) => (
                            <div
                                key={index}
                                className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded"
                            >
                                • {name}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    </div>
}
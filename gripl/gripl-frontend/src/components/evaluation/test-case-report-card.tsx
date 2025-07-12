import {TestCaseReport} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import useLoadPreviewImage from "@/hooks/use-load-preview-image";

interface TestCaseReportCardProps {
    report: TestCaseReport
}

export default function TestCaseReportCard({ report }: TestCaseReportCardProps) {

    const { previewImage, isLoading } = useLoadPreviewImage({
        testCaseId: report.testCaseId,
        correctActivityIds: report.correctActivityIds,
        falsePositiveIds: report.falsePositiveIds,
        falseNegativeIds: report.falseNegativeIds,
    })

    return <Card>
        <CardHeader>
            <CardTitle className="text-xl font-bold">Test Case {report.testCaseId} - {report.testCaseName}</CardTitle>
        </CardHeader>
        <CardContent>
            <>
                { isLoading ? <Skeleton className="h-28 w-full" /> : previewImage }
            </>
            <ul className="mt-4">
                <li className="mb-1"><span className="font-bold">Expected:</span> {report.expectedNamesWithIds.join(", ")}</li>
                <li className="mb-1"><span className="font-bold">Actual:</span> {report.actualNamesWithIds.join(", ")}</li>
                <li className="mb-1"><span className="font-bold">Result:</span> {report.isSuccessful ? "✅ Passed" : "❌ Failed"}</li>
            </ul>
            <details className="mt-4">
                <summary><h2 className="text-lg font-bold mt-4">Reasoning of the LLM:</h2></summary>
                <ul className="mt-4">
                    { report.result.map((result) => {
                        return <li key={result.value} className="mb-1">
                            <span className="font-bold">{
                                report.actualNamesWithIds.find(nameWithId => nameWithId.includes(result.value)) || result.value
                            }:</span> {result.reason || "No reason provided"}
                        </li>
                    })}
                </ul>
            </details>
        </CardContent>
    </Card>
}
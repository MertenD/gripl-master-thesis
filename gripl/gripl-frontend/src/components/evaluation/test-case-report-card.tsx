import {TestCaseReport} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import useLoadPreviewImage from "@/hooks/use-load-preview-image";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";

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
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
    >
        <Card>
            <CollapsibleTrigger className="w-full">
                <CardHeader className="w-full flex flex-row justify-between">
                    <CardTitle className="text-xl font-bold">
                        {report.isSuccessful ? "✅ " : "❌ "}
                        Test Case {report.testCaseId} - {report.testCaseName}
                    </CardTitle>
                    <>{ isOpen ? <ChevronDown /> : <ChevronUp /> }</>
                </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <CardContent>
                    <ul className="mb-4">
                        <li className="mb-1"><span
                            className="font-bold">- Expected:</span> {report.expectedNamesWithIds.join(", ")}</li>
                        <li className="mb-1"><span
                            className="font-bold">- Actual:</span> {report.actualNamesWithIds.join(", ")}</li>
                        <li className="mb-1"><span
                            className="font-bold">- Result:</span> {report.isSuccessful ? "✅ Passed" : "❌ Failed"}</li>
                    </ul>
                    <>
                        {isLoading ? <Skeleton className="h-28 w-full"/> : previewImage}
                    </>
                    <h2 className="text-lg font-bold mt-4">Reasoning of the LLM:</h2>
                    <ul className="mt-4">
                        {report.result.map((result) => {
                            return <li key={result.value} className="mb-1">
                                <span className="font-bold">- {
                                    report.actualNamesWithIds.find(nameWithId => nameWithId.includes(result.value)) || result.value
                                }:</span> {result.reason || "No reason provided"}
                            </li>
                        })}
                    </ul>
                </CardContent>
            </CollapsibleContent>
        </Card>
    </Collapsible>
}
import {EvaluationReportError} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface TestCaseErrorCardProps {
    error: EvaluationReportError
}

export default function TestCaseErrorCard({ error }: TestCaseErrorCardProps) {

    return <Card>
        <CardHeader>
            <CardTitle className="text-xl font-bold text-destructive">⚠️ Error in Test Case {error.testCaseId} - {error.testCaseName}</CardTitle>
        </CardHeader>
        <CardContent>
            {error.errorMessage}
        </CardContent>
    </Card>
}
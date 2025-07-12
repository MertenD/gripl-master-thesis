import {EvaluationReportSummary} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface SummaryReportCardProps {
    reportSummary: EvaluationReportSummary
}

export default function EvaluationReportSummaryCard({ reportSummary }: SummaryReportCardProps) {
    return <Card>
        <CardHeader>
            <CardTitle className="text-xl font-bold">Evaluation Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <ul>
                <li className="mb-1"><span className="font-bold">Total Test Cases:</span> {reportSummary.total}</li>
                <li className="mb-1"><span className="font-bold">✅ Passed:</span> {reportSummary.passed}</li>
                <li className="mb-1"><span className="font-bold">❌ Failed:</span> {reportSummary.failed}</li>
                <li className="mb-1"><span className="font-bold">⚠️ Errors:</span> {reportSummary.error}</li>
            </ul>
        </CardContent>
    </Card>
}
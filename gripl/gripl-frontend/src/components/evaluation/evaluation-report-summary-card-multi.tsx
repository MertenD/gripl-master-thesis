import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {EvaluationMetadataReport, EvaluationReportSummary} from "@/models/dto/ReportData";

export default function EvaluationReportSummaryCardMulti({
 items,
 metadata
}: { items: Array<{ label: string; summary: EvaluationReportSummary }>, metadata: EvaluationMetadataReport | null }) {
    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Evaluation Summary (All Models)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(({ label, summary }) => {
                        const rate = summary.total ? summary.passed / summary.total : 0;
                        return (
                            <div key={label} className="rounded-xl border p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-semibold">{label}</div>
                                    <Badge variant="outline">{pct(rate)}</Badge>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div><div className="text-xl font-bold text-chart-success">{summary.passed}</div><div className="text-xs text-muted-foreground">Passed</div></div>
                                    <div><div className="text-xl font-bold text-chart-error">{summary.failed}</div><div className="text-xs text-muted-foreground">Failed</div></div>
                                    <div><div className="text-xl font-bold text-chart-warning">{summary.error}</div><div className="text-xs text-muted-foreground">Errors</div></div>
                                    <div><div className="text-xl font-bold">{summary.total}</div><div className="text-xs text-muted-foreground">Total</div></div>
                                </div>
                                <Progress value={rate * 100} className="h-2 mt-3" />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

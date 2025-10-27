import { EvaluationReportSummary } from "@/models/dto/ReportData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface SummaryReportCardSingleProps {
    reportSummary: EvaluationReportSummary;
}

export default function EvaluationReportSummaryCardSingle({ reportSummary }: SummaryReportCardSingleProps) {
    const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
    const formatDecimal = (value: number) => value.toFixed(3);
    const successRate = reportSummary.total > 0 ? reportSummary.passed / reportSummary.total : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Evaluation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-chart-success">{reportSummary.passed}</div>
                            <div className="text-sm text-muted-foreground">Passed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-chart-error">{reportSummary.failed}</div>
                            <div className="text-sm text-muted-foreground">Failed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-chart-warning">{reportSummary.error}</div>
                            <div className="text-sm text-muted-foreground">Errors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{reportSummary.total}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between mb-2">
                            <span>Success Rate</span>
                            <span>{formatPercentage(successRate)}</span>
                        </div>
                        <Progress value={successRate * 100} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-metric-4">{formatDecimal(reportSummary.accuracy)}</div>
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                            <Progress value={reportSummary.accuracy * 100} className="h-2 mt-2" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-metric-1">{formatDecimal(reportSummary.precision)}</div>
                            <div className="text-sm text-muted-foreground">Precision</div>
                            <Progress value={reportSummary.precision * 100} className="h-2 mt-2" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-metric-2">{formatDecimal(reportSummary.recall)}</div>
                            <div className="text-sm text-muted-foreground">Recall</div>
                            <Progress value={reportSummary.recall * 100} className="h-2 mt-2" />
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-chart-metric-3">{formatDecimal(reportSummary.f1Score)}</div>
                            <div className="text-sm text-muted-foreground">F1-Score</div>
                            <Progress value={reportSummary.f1Score * 100} className="h-2 mt-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import {EvaluationReportSummary} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";

interface SummaryReportCardProps {
    reportSummary: EvaluationReportSummary
}

export default function EvaluationReportSummaryCard({ reportSummary }: SummaryReportCardProps) {
    const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
    const formatDecimal = (value: number) => value.toFixed(3);

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
                            <span>{formatPercentage(reportSummary.passed / reportSummary.total)}</span>
                        </div>
                        <Progress value={(reportSummary.passed / reportSummary.total) * 100} className="h-2" />
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

            <Card>
                <CardHeader>
                    <CardTitle>Confusion Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-32"></TableHead>
                                <TableHead className="text-center">Predicted Positive</TableHead>
                                <TableHead className="text-center">Predicted Negative</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Actual Positive</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="default" className="bg-chart-success/10 text-chart-success border-chart-success/20">
                                        TP: {reportSummary.totalTruePositives}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="default" className="bg-chart-warning/10 text-chart-warning border-chart-warning/20">
                                        FN: {reportSummary.totalFalseNegatives}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Actual Negative</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="default" className="bg-chart-error/10 text-chart-error border-chart-error/20">
                                        FP: {reportSummary.totalFalsePositives}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="default" className="bg-chart-info/10 text-chart-info border-chart-info/20">
                                        TN: {reportSummary.totalTrueNegatives}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p><strong>TP:</strong> True Positives - Correctly identified positive cases</p>
                        <p><strong>FP:</strong> False Positives - Incorrectly identified as positive</p>
                        <p><strong>FN:</strong> False Negatives - Missed positive cases</p>
                        <p><strong>TN:</strong> True Negatives - Correctly identified negative cases</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Accuracy</TableCell>
                                <TableCell>{formatDecimal(reportSummary.accuracy)}</TableCell>
                                <TableCell>{formatPercentage(reportSummary.accuracy)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    Overall correctness of predictions
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Precision</TableCell>
                                <TableCell>{formatDecimal(reportSummary.precision)}</TableCell>
                                <TableCell>{formatPercentage(reportSummary.precision)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    Proportion of positive predictions that were correct
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Recall</TableCell>
                                <TableCell>{formatDecimal(reportSummary.recall)}</TableCell>
                                <TableCell>{formatPercentage(reportSummary.recall)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    Proportion of actual positives that were correctly identified
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">F1-Score</TableCell>
                                <TableCell>{formatDecimal(reportSummary.f1Score)}</TableCell>
                                <TableCell>{formatPercentage(reportSummary.f1Score)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    Harmonic mean of precision and recall
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

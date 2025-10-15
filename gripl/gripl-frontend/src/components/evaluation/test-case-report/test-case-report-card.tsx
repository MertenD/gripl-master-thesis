"use client"

import type {TestCaseReport} from "@/models/dto/ReportData"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {useState} from "react"
import {CheckCircle2, ChevronDown, ChevronRight, XCircle} from "lucide-react"
import TestCaseReportCardPreview from "@/components/evaluation/test-case-report/test-case-report-card-preview";
import TestCaseReportCardReasoning from "@/components/evaluation/test-case-report/test-case-report-card-reasoning";
import TestCaseReportCardOverview from "@/components/evaluation/test-case-report/test-case-report-card-overview";
import TestCaseReportCardComparison from "@/components/evaluation/test-case-report/test-case-report-card-comparison";

interface TestCaseReportCardProps {
    report: TestCaseReport
}

export default function TestCaseReportCard({ report }: TestCaseReportCardProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const totalExpected = report.expectedNamesWithIds.length
    const totalActual = report.actualNamesWithIds.length
    const correctCount = report.correctActivityIds?.length || 0
    const falsePositiveCount = report.falsePositiveIds?.length || 0
    const amountOfRetries = report.amountOfRetries

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CollapsibleTrigger className="w-full">
                    <CardHeader className="w-full flex flex-row items-center justify-between p-4 hover:bg-muted/30">
                        <div className="flex items-center gap-3">
                            {report.isSuccessful ? (
                                <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                            )}
                            <div className="text-left">
                                <CardTitle className="text-lg font-semibold">{report.testCaseName} ({report.testCaseId})</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">{correctCount}/{totalExpected} correct, {falsePositiveCount} false positives {amountOfRetries !== undefined && amountOfRetries !== null ? `, retried ${amountOfRetries} times` : null}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={report.isSuccessful ? "bg-success" : "bg-destructive"}>
                                {report.isSuccessful ? "Passed" : "Failed"}
                            </Badge>
                            {isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                    </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <CardContent className="p-4 pt-0 space-y-6">
                        <TestCaseReportCardOverview totalExpected={totalExpected} totalActual={totalActual} correctCount={correctCount} />
                        <Separator />
                        <TestCaseReportCardComparison report={report} />
                        <TestCaseReportCardPreview report={report} />
                        <Separator />
                        <TestCaseReportCardReasoning report={report} />
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}

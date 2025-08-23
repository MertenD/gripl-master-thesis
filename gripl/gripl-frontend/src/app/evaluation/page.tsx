// src/app/(your)/evaluation/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
    EvaluationReport,
    EvaluationReportError,
    EvaluationReportStepInfo,
    EvaluationReportSummary,
    TestCaseReport
} from "@/models/dto/ReportData";
import TestCaseReportCard from "@/components/evaluation/test-case-report-card";
import EvaluationReportSummaryCard from "@/components/evaluation/evaluation-report-summary-card";
import MetricsCharts from "@/components/evaluation/metrics-charts";
import { Spinner } from "@/components/ui/spinner";
import { MultiEvaluationRequest } from "@/models/dto/MultiEvaluationRequest";
import EvaluationConfigCardMulti from "@/components/evaluation/evaluation-config-card-multi";
import TestCaseErrorCard from "@/components/evaluation/test-case-error-card";

type ModelReportEnvelope = {
    modelLabel: string;
    report: EvaluationReport;
};

export default function EvaluationPage() {
    const [evaluationRequest, setEvaluationRequest] = useState<MultiEvaluationRequest | null>(null);

    const [testCases, setTestCases] = useState<(TestCaseReport & { modelLabel: string })[]>([]);
    const [summary, setSummary] = useState<(EvaluationReportSummary & { modelLabel: string }) | null>(null);
    const [currentStepInfo, setCurrentStepInfo] = useState<(EvaluationReportStepInfo & { modelLabel: string }) | null>(null);
    const [errors, setErrors] = useState<(EvaluationReportError & { modelLabel: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleEvaluationStart = async () => {
        if (!evaluationRequest) return;

        setTestCases([]);
        setSummary(null);
        setCurrentStepInfo(null);
        setErrors([]);
        setIsLoading(true);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/evaluation/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(evaluationRequest)
        });

        if (!res.ok || !res.body) {
            console.error("Request failed:", res.status, res.statusText);
            setIsLoading(false);
            return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                try {
                    const env = JSON.parse(line) as ModelReportEnvelope;
                    const { modelLabel, report } = env;

                    if (report.type === "testCase") {
                        setTestCases((prev) => [...prev, { ...(report as TestCaseReport), modelLabel }]);
                    } else if (report.type === "summary") {
                        setSummary({ ...(report as EvaluationReportSummary), modelLabel });
                    } else if (report.type === "stepInfo") {
                        setCurrentStepInfo({ ...(report as EvaluationReportStepInfo), modelLabel });
                    } else if (report.type === "error") {
                        setErrors((prev) => [...prev, { ...(report as EvaluationReportError), modelLabel }]);
                    } else {
                        console.warn("Unknown report type:", report);
                    }
                } catch (e) {
                    console.error("Failed to parse NDJSON line:", e);
                }
            }

            buffer = lines[lines.length - 1];
        }

        setIsLoading(false);
    };

    const handleDownloadMarkdownReport = () => {
        if (!testCases.length && !summary) {
            alert("No results yet.");
            return;
        }
        const sections: string[] = [];

        const byModel = groupBy(testCases, (x) => x.modelLabel);

        Object.keys(byModel).forEach((label) => {
            sections.push(`# Model: ${label}`);
            const cases = byModel[label];
            sections.push(...cases.map((c) => c.markdown));
        });

        if (summary) {
            sections.push(`# Summary (${summary.modelLabel})`);
            sections.push(summary.markdown);
        }

        const blob = new Blob([sections.join("\n\n")], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "evaluation_report_multi.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full w-full p-6">
            <EvaluationConfigCardMulti onMultiConfigChanged={setEvaluationRequest} className="mb-4">
                <div className="flex flex-row justify-end items-center mb-4 space-x-4">
                    <Button variant="default" disabled={isLoading || !evaluationRequest} onClick={handleEvaluationStart}>
                        <>
                        {!isLoading && "Start Evaluation"}
                        {isLoading && <div className="flex flex-row space-x-4">
                            <Spinner className="h-4 w-4 text-foreground" />
                            {currentStepInfo && (
                                <p>
                                    [{currentStepInfo.modelLabel}] Evaluating {currentStepInfo.currentTestCaseName}… (
                                    {currentStepInfo.currentTestCaseNumber} / {currentStepInfo.totalTestCases})
                                </p>
                            )}
                        </div>}
                        </>
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={handleDownloadMarkdownReport}>
                        Download Markdown Report
                    </Button>
                </div>
            </EvaluationConfigCardMulti>

            {summary && (
                <div className="space-y-6 mb-6">
                    <EvaluationReportSummaryCard reportSummary={summary} />
                    <MetricsCharts reportSummary={summary} />
                </div>
            )}

            <div className="flex flex-col space-y-4 pb-6">
                {testCases.map((report) => (
                    <div key={`${report.modelLabel}-${report.testCaseId}`}>
                        <div className="text-xs text-muted-foreground mb-1">Model: {report.modelLabel}</div>
                        <TestCaseReportCard report={report} />
                    </div>
                ))}
            </div>

            {errors.length > 0 && (
                <div className="flex flex-col space-y-4 pb-4">
                    {errors.map((e, idx) => (
                        <div key={`${e.modelLabel}-${e.testCaseId}-${idx}`}>
                            <div className="text-xs text-muted-foreground mb-1">Model: {e.modelLabel}</div>
                            <TestCaseErrorCard error={e} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function groupBy<T>(arr: T[], key: (t: T) => string) {
    return arr.reduce<Record<string, T[]>>((acc, item) => {
        const k = key(item);
        // @ts-ignore
        (acc[k] ||= []).push(item);
        return acc;
    }, {});
}

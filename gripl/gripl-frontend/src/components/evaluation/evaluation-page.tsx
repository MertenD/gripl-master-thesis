"use client";

import {Button} from "@/components/ui/button";
import React, {useEffect, useMemo, useState} from "react";
import {
    EvaluationMetadataReport,
    EvaluationReport,
    EvaluationReportError,
    EvaluationReportStepInfo,
    EvaluationReportSummary,
    TestCaseReport
} from "@/models/dto/ReportData";
import TestCaseReportCard from "@/components/evaluation/test-case-report/test-case-report-card";
import EvaluationReportSummaryCard from "@/components/evaluation/evaluation-report-summary-card";
import MetricsCharts from "@/components/evaluation/metrics-charts";
import {Spinner} from "@/components/ui/spinner";
import {MultiEvaluationRequest} from "@/models/dto/MultiEvaluationRequest";
import TestCaseErrorCard from "@/components/evaluation/test-case-report/test-case-error-card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card} from "@/components/ui/card";
import EvaluationConfig from "@/components/evaluation/config/evaluation-config";
import {Dataset} from "@/models/dto/Dataset";
import {FileText, Play} from "lucide-react";

type ModelReportEnvelope = {
    modelLabel: string;
    report: EvaluationReport;
};

interface EvaluationPageProps {
    datasets: Dataset[];
}

export default function EvaluationPage({ datasets }: EvaluationPageProps) {
    const [evaluationRequest, setEvaluationRequest] = useState<MultiEvaluationRequest | null>(null);

    const [models, setModels] = useState<string[]>([]);
    const [metadata, setMetadata] = useState<EvaluationMetadataReport | null>(null);
    const [testCases, setTestCases] = useState<(TestCaseReport & { modelLabel: string })[]>([]);
    const [summary, setSummary] = useState<Map<string, EvaluationReportSummary>>(new Map());
    const [currentStepInfos, setCurrentStepInfos] = useState<(EvaluationReportStepInfo & { modelLabel: string })[]>([]);
    const [errors, setErrors] = useState<(EvaluationReportError & { modelLabel: string })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const handleEvaluationStart = async () => {
        if (!evaluationRequest) return;

        setMetadata(null);
        setTestCases([]);
        setSummary(new Map());
        setCurrentStepInfos([]);
        setModels(evaluationRequest.models.map((m) => m.label));
        setErrors([]);
        setIsLoading(true);
        setIsFinished(false);

        console.log("Sending request", evaluationRequest)

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

                    console.log(`Received report for model: ${modelLabel}`, report);

                    if (report.type === "metadata") {
                        console.log("Metadata report received:", report);
                        setMetadata(report);
                    } else if (report.type === "testCase") {
                        setTestCases((prev) => [...prev, { ...(report as TestCaseReport), modelLabel }]);
                    } else if (report.type === "summary") {
                        setSummary((prev) => {
                            const next = new Map(prev);
                            next.set(modelLabel, report as EvaluationReportSummary);
                            return next;
                        });
                    } else if (report.type === "stepInfo") {
                        setCurrentStepInfos((prev) => [...prev, { ...(report as EvaluationReportStepInfo), modelLabel }]);
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
        setIsFinished(true);
    };

    useEffect(() => {
        if (isFinished || isLoading) return;
        setModels(evaluationRequest?.models.map((m) => m.label) || []);
    }, [evaluationRequest]);

    useEffect(() => {
        setCurrentStepInfos((infos) =>
            infos.filter((info) =>
                !testCases.some(
                    (testCase) =>
                        testCase.modelLabel === info.modelLabel &&
                        testCase.testCaseId === info.currentTestCaseId
                ) && !errors.some(
                    (error) =>
                        error.modelLabel === info.modelLabel &&
                        error.testCaseId === info.currentTestCaseId
                    )
            )
        );
    }, [testCases]);

    const handleDownloadMarkdownReport = () => {
        const hasSummaries = summary && summary.size > 0;
        if (!testCases.length && !hasSummaries) {
            alert("No results yet.");
            return;
        }
        const sections: string[] = [];

        if (metadata) {
            sections.push("# Evaluation Report");
            sections.push(metadata.markdown);
        }

        const byModel = groupBy(testCases, (x) => x.modelLabel);

        Object.keys(byModel).forEach((label) => {
            sections.push(`# Model: ${label}`);
            const cases = byModel[label];
            sections.push(...cases.map((c) => c.markdown));
        });

        for (const [modelLabel, modelSummary] of summary.entries()) {
            sections.push(`# Summary (${modelLabel})`);
            sections.push(modelSummary.markdown);
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

    const handleDownloadJsonReport = () => {
        const hasSummaries = summary && summary.size > 0;
        if (!testCases.length && !hasSummaries) {
            alert("No results yet.");
            return;
        }
        const report = {
            metadata,
            testCases,
            summaries: Array.from(summary.entries()).map(([label, s]) => ({ label, summary: s })),
            errors
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "evaluation_report_multi.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const handleUploadJsonReport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== "string") throw new Error("File content is not a string");

                const parsed = JSON.parse(text);
                if (!parsed.testCases || !parsed.summaries) throw new Error("Invalid report format");

                setMetadata(parsed.metadata || null);
                setTestCases(parsed.testCases);
                const summaryMap = new Map<string, EvaluationReportSummary>();
                parsed.summaries.forEach((s: { label: string; summary: EvaluationReportSummary }) => {
                    summaryMap.set(s.label, s.summary);
                });
                setSummary(summaryMap);
                setErrors(parsed.errors || []);
                setModels(Array.from(summaryMap.keys()));
            } catch (err) {
                console.error("Failed to load report:", err);
                alert("Failed to load report: " + (err as Error).message);
            }
        };
        reader.readAsText(file);
        setIsFinished(true);
    };

    const onUploadJsonReportClick = () => {
        document.getElementById("upload-json-report")?.click()
    };

    const summariesByModel = useMemo(
        () => Array.from(summary.entries()).map(([label, s]) => ({ label, summary: s })),
        [summary]
    );

    return (
        <div className="w-full">
            <EvaluationConfig onMultiConfigChanged={setEvaluationRequest} datasets={datasets} className="mb-6">
                <div className="flex flex-row justify-between items-start flex-wrap mb-4 gap-4">
                    <div className="flex flex-row gap-4 flex-wrap">
                        <Button variant="secondary" disabled={!isFinished} onClick={handleDownloadMarkdownReport}>
                            <FileText className="h-4 w-4" />
                            Download Markdown Report
                        </Button>
                        <Button variant="secondary" disabled={!isFinished} onClick={handleDownloadJsonReport}>
                            <FileText className="h-4 w-4" />
                            Download JSON Report
                        </Button>
                        <input id="upload-json-report" type="file" accept=".json" className="hidden" onChange={handleUploadJsonReport} />
                        <label htmlFor="upload-json-report">
                            <Button variant="secondary" onClick={onUploadJsonReportClick} disabled={isLoading} className="hover:cursor-pointer">
                                <span className="flex flex-row items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Upload JSON Report
                                </span>
                            </Button>
                        </label>
                    </div>
                    <Button variant="default" disabled={isLoading || !evaluationRequest}
                            onClick={handleEvaluationStart} className="h-auto">
                        <>
                            {!isLoading && <Play className="h-4 w-4" /> }
                            {!isLoading && "Start Evaluation"}
                            {isLoading && (
                                <div className="flex flex-row space-x-4">
                                    <Spinner className="h-4 w-4 text-foreground"/>
                                    {currentStepInfos.length > 0 && (
                                        <div className="flex flex-row items-center space-x-4">
                                            <div className="flex flex-col justify-start overflow-y-auto">
                                                {currentStepInfos.map((info, idx) => (
                                                    <span key={`${info.modelLabel}-stepinfo-${idx}`}
                                                          className="whitespace-nowrap">
                                                    [{info.modelLabel}] Evaluating {info.currentTestCaseName}...
                                                </span>
                                                ))}
                                            </div>
                                            <p>({testCases.length + errors.length} / {currentStepInfos[0].totalTestCases * (evaluationRequest?.models.length || 1)})</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    </Button>
                </div>
            </EvaluationConfig>

            <section className="px-6">
                <h2 className="text-2xl font-semibold mb-2">Complete Result Overview</h2>
                {summariesByModel.length > 0 || metadata ? <>
                    <div className="space-y-6 mb-8">
                        <EvaluationReportSummaryCard reportSummaries={summariesByModel} metadata={metadata}/>
                        <MetricsCharts reportSummaries={summariesByModel}/>
                    </div>
                </> : <Card className="p-4 mb-4">
                    <p className="text-muted-foreground">No results yet. Start an evaluation to see results here.</p>
                </Card>}

                <h2 className="text-2xl font-semibold mb-2">Results by Model</h2>
                <Tabs className="w-full">
                    <TabsList className="w-full h-12 sticky top-0 z-10">
                        {models.map((label) => (
                                <TabsTrigger value={label} key={`${label}-trigger`}>
                                    {label}
                                </TabsTrigger>
                            ))}
                    </TabsList>

                    {models.map((label) => {
                        const modelSummary = summary?.get(label);

                        return (
                            <TabsContent value={label} key={`${label}-content`}>
                                { !modelSummary && !testCases.some((tc) => tc.modelLabel === label) && !errors.some((e) => e.modelLabel === label) && (
                                    <Card className="p-4 text-muted-foreground">
                                        No results yet for model <strong>{label}</strong>. Start an evaluation to see results here.
                                    </Card>
                                )}

                                {modelSummary && (
                                    <div className="space-y-6 mb-6">
                                        <EvaluationReportSummaryCard reportSummary={modelSummary}/>
                                        <MetricsCharts reportSummary={modelSummary}/>
                                    </div>
                                )}

                                <div className="flex flex-col space-y-4 pb-6">
                                    {testCases
                                        .filter((testCase) => testCase.modelLabel === label)
                                        .sort((a, b) => a.testCaseId - b.testCaseId)
                                        .map((report) => (
                                            <div key={`${report.modelLabel}-${report.testCaseId}`}>
                                                <TestCaseReportCard report={report}/>
                                            </div>
                                        ))}
                                </div>

                                {errors.filter((error) => error.modelLabel === label).length > 0 && (
                                    <div className="flex flex-col space-y-4 pb-4">
                                        {errors
                                            .filter((error) => error.modelLabel === label)
                                            .map((e, idx) => (
                                                <div key={`${e.modelLabel}-${e.testCaseId}-${idx}`}>
                                                    <TestCaseErrorCard error={e}/>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </section>
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

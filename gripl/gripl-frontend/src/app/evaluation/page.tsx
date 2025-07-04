"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {
    EvaluationReport,
    EvaluationReportStepInfo,
    EvaluationReportSummary,
    TestCaseReport
} from "@/models/dto/ReportData";
import TestCaseReportCard from "@/components/evaluation/test-case-report-card";
import EvaluationReportSummaryCard from "@/components/evaluation/evaluation-report-summary-card";
import {Spinner} from "@/components/ui/spinner";

export default function EvaluationPage() {
    const [testCases, setTestCases] = useState<TestCaseReport[]>([])
    const [summary, setSummary] = useState<EvaluationReportSummary | null>(null)
    const [currentStepInfo, setCurrentStepInfo] = useState<EvaluationReportStepInfo | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleEvaluationStart = async () => {
        setTestCases([])
        setSummary(null)
        setCurrentStepInfo(null)
        setIsLoading(true)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/evaluation/stream`,
            {credentials: "include"}
        )
        if (!res.ok || !res.body) {
            console.error("Request failed:", res.status, res.statusText)
            return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
            const {done, value} = await reader.read()
            if (done) break

            buffer += decoder.decode(value, {stream: true})
            const lines = buffer.split("\n")

            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim()
                if (!line) continue

                try {
                    const obj = JSON.parse(line) as EvaluationReport
                    if (obj.type === "testCase") {
                        setTestCases(prev => [...prev, obj as TestCaseReport])
                    } else if (obj.type === "summary") {
                        setSummary(obj as EvaluationReportSummary)
                    } else if (obj.type === "stepInfo") {
                        setCurrentStepInfo(obj as EvaluationReportStepInfo)
                    } else {
                        console.warn("Unknown report type:", obj)
                    }
                } catch (e) {
                    console.error("Failed to parse NDJSON line:", e);
                }
            }

            buffer = lines[lines.length - 1]
        }

        setIsLoading(false);
    }

    const handleDownloadMarkdownReport = () => {
        if (!summary || !testCases) {
            console.warn("Some data is missing for the report download.");
            alert("Something went wrong while preparing the report. Please try again later.");
            return;
        }

        const summaryMarkdown = summary.markdown;
        const testCasesMarkdown = testCases.map((report => report.markdown))
        const fullMarkdown = [summaryMarkdown, testCasesMarkdown].flat().join("\n\n");
        const blob = new Blob([fullMarkdown], {type: "text/markdown"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "evaluation_report.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    return <div className="h-full w-full p-6">
        <div className="flex flex-row justify-between items-center mb-4">
            <Button variant="default" disabled={isLoading} onClick={handleEvaluationStart}>
                {!isLoading && "Start Evaluation"}
                {isLoading && <div className="flex flex-row space-x-4">
                    <Spinner className="h-4 w-4 text-foreground" />
                    {currentStepInfo && <p>
                        Evaluating {currentStepInfo?.currentTestCaseName}... ({currentStepInfo.currentTestCaseNumber} / {currentStepInfo.totalTestCases})
                    </p>}
                </div>}
            </Button>
            <Button variant="secondary" disabled={isLoading || !summary || !testCases} onClick={handleDownloadMarkdownReport}>
                Download Markdown Report
            </Button>
        </div>
        <div className="mb-4">
            {summary && <EvaluationReportSummaryCard reportSummary={summary}/>}
        </div>
        <div className="flex flex-col space-y-4 pb-6">
            {testCases.map((report) => <TestCaseReportCard report={report} key={report.testCaseId}/>)}
        </div>
    </div>
}
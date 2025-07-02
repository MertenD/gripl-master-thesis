"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {EvaluationReport, EvaluationReportSummary, TestCaseReport} from "@/models/dto/ReportData";
import TestCaseReportCard from "@/components/evaluation/test-case-report-card";
import EvaluationReportSummaryCard from "@/components/evaluation/evaluation-report-summary-card";

export default function EvaluationPage() {
    const [testCases, setTestCases] = useState<TestCaseReport[]>([])
    const [summary, setSummary] = useState<EvaluationReportSummary | null>(null)

    const handleEvaluationStart = async () => {
        setTestCases([])
        setSummary(null)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/evaluation/stream`,
            {credentials: "include"} // falls CORS mit Credentials
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
                    } else {
                        console.warn("Unknown report type:", obj)
                    }
                } catch (e) {
                    console.error("Failed to parse NDJSON line:", e);
                }
            }

            buffer = lines[lines.length - 1]
        }
    }

    return <div className="h-full w-full p-6">
        <Button variant="default" onClick={handleEvaluationStart} className="mb-4">
            Start Evaluation
        </Button>
        <div className="mb-4">
            {summary && <EvaluationReportSummaryCard reportSummary={summary}/>}
        </div>
        <div className="flex flex-col space-y-4 pb-6">
            {testCases.map((report) => <TestCaseReportCard report={report} key={report.testCaseId}/>)}
        </div>
    </div>
}
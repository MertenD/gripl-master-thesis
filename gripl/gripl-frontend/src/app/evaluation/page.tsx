"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {MarkdownContent} from "@/components/markdown-content";

export default function EvaluationPage() {
    const [report, setReport] = useState<string>("")

    const handleEvaluationStart = () => {
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/evaluation/stream`)

        eventSource.onmessage = (e) => {
            console.log("Received SSE message:", e.data)
            setReport(prevReport => prevReport + e.data + "\n")
        }

        eventSource.onerror = (err) => {
            console.error("SSE error:", err)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }

    return <div className="h-full w-full">
        <Button variant="default" onClick={handleEvaluationStart}>
            Start Evaluation
        </Button>
        { report !== "" &&  <MarkdownContent content={report} /> }
    </div>
}
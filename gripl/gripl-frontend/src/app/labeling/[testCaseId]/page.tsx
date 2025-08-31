import {EvaluationData} from "@/models/dto/EvaluationData";
import LabelingEditor from "@/components/labeling/labeling-editor";
import React from "react";

export default async function LabelingPageWithEditor({ params }: { params: Promise<{ testCaseId: string }> }) {

    const {testCaseId} = await params;
    const evaluationData: EvaluationData | null = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset/testcase/${testCaseId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json() as unknown as EvaluationData
        })
        .catch(error => {
            console.error("There was an error fetching the evaluation data:", error);
            return null;
        });

    if (!evaluationData) {
        return <div className="h-full w-full flex items-center justify-center">
            <h2 className="font-bold text-2xl">No data found for test case {testCaseId}</h2>
        </div>
    }

    return <LabelingEditor className="flex-1" evaluationData={evaluationData}/>
}
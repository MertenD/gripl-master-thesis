import React from "react";
import DatasetList from "@/components/labeling/dataset-list";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";

export const dynamic = 'force-dynamic';

export default async function LabelingPageLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    const evaluationMetadata: EvaluationDataMeta[] = await fetch(`${process.env.API_BASE_URL}/dataset`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(data => {
            console.log("Data", data);
            return data.json()
        })
        .catch(error => {
            console.log("There was an error fetching the dataset metadata:", error);
            return []
        })

    return <div className="w-full h-full flex flex-row">
        <DatasetList className="w-72 shrink-0" evaluationMetadata={evaluationMetadata} />
        { children }
    </div>
}

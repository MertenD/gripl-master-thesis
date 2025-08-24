import React from "react";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import DatasetList from "@/components/labeling/dataset-list";

export default async function LabelingPage() {

    const evaluationMetadata: EvaluationDataMeta[] = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset`, {
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

    const datasetIds = Array.from(new Set(evaluationMetadata.map(meta => meta.datasetId).filter(id => id !== undefined))) as number[];

    return <DatasetList datasetIds={datasetIds} evaluationMetadata={evaluationMetadata}/>
}
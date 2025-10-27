import React from "react";
import getDatasets from "@/actions/get-datasets";
import EvaluationPage from "@/components/evaluation/evaluation-page";

export const dynamic = 'force-dynamic'

export default async function Evaluation() {

    const datasets = await getDatasets()

    return <EvaluationPage datasets={datasets} />
}
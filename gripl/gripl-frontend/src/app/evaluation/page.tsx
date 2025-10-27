import React from "react";
import getDatasets from "@/actions/get-datasets";
import EvaluationPage from "@/components/evaluation/evaluation-page";
import {ColorProvider} from "@/components/evaluation/charts/common/color-context";

export default async function Evaluation() {

    const datasets = await getDatasets()

    return <ColorProvider>
        <EvaluationPage datasets={datasets} />
    </ColorProvider>
}
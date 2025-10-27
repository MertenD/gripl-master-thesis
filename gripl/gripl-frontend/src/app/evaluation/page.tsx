"use client"

import React from "react";
import getDatasets from "@/actions/get-datasets";
import EvaluationPage from "@/components/evaluation/evaluation-page";
import {Dataset} from "@/models/dto/Dataset";
import {ColorProvider} from "@/components/evaluation/charts/common/color-context";

export default function Evaluation() {

    const [datasets, setDatasets] = React.useState<Dataset[]>([]);

    React.useEffect(() => {
        async function fetchDatasets() {
            const data = await getDatasets();
            setDatasets(data);
        }

        fetchDatasets();
    }, []);

    return <ColorProvider>
        <EvaluationPage datasets={datasets} />
    </ColorProvider>
}
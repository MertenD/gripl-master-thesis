"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {Dataset} from "@/models/dto/Dataset";
import {ColorProvider} from "@/components/evaluation/charts/common/color-context";
import { Spinner } from "@/components/ui/spinner";
import getDatasets from "@/actions/get-datasets";

const EvaluationPage = dynamic(() => import("@/components/evaluation/evaluation-page"), {
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-screen"><Spinner size="large" /></div>
});

export default function Evaluation() {
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const data = await getDatasets();
                setDatasets(data);
            } catch (error) {
                console.error('Failed to fetch datasets:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDatasets();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="large" /></div>;
    }

    return <ColorProvider>
        <EvaluationPage datasets={datasets} />
    </ColorProvider>
}
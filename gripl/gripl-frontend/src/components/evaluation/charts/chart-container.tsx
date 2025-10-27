"use client"

import React, {ReactNode, useCallback} from "react";
import {useCurrentPng} from "recharts-to-png";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {ImageDown} from "lucide-react";
import ChartMenu from "@/components/evaluation/charts/common/chart-menu";

interface ChartContainerProps {
    title: string
    children: ReactNode
}

export default function ChartContainer({ title, children }: ChartContainerProps) {

    const [getPng, { ref, isLoading }] = useCurrentPng();

    const handleDownload = useCallback(async () => {
        const png = await getPng();

        if (png) {
            const link = document.createElement("a");
            link.href = png;
            link.download = "performance-metrics.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [getPng]);

    return <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <ChartMenu onDownload={handleDownload} />
        </CardHeader>
        <CardContent>
            <div ref={ref}>
                {children}
            </div>
        </CardContent>
    </Card>
}
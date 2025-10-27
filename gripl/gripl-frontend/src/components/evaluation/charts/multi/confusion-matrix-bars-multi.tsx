"use client"

import dynamic from "next/dynamic"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import ChartMenu from "@/components/evaluation/charts/common/chart-menu";
import {useEffect, useState} from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ConfusionMatrixPerModelProps {
    reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }>
}

export function ConfusionMatrixBarsMulti({ reportSummaries }: ConfusionMatrixPerModelProps) {
    const [isClient, setIsClient] = useState(false)
    const chartId = "confusion-matrix-chart"

    const series = [
        {
            name: "True Positives",
            data: reportSummaries.map((report) => report.summary.totalTruePositives),
        },
        {
            name: "False Positives",
            data: reportSummaries.map((report) => report.summary.totalFalsePositives),
        },
        {
            name: "False Negatives",
            data: reportSummaries.map((report) => report.summary.totalFalseNegatives),
        },
        {
            name: "True Negatives",
            data: reportSummaries.map((report) => report.summary.totalTrueNegatives),
        },
    ]

    useEffect(() => {
        setIsClient(true)
    }, [])

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: chartId,
            type: "bar",
            toolbar: { show: false },
            animations: { enabled: false}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "85%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: reportSummaries.map((report) => report.label),
            labels: {
                rotate: -42,
                rotateAlways: true,
                style: { fontSize: "10px" }
            },
        },
        yaxis: {
            title: {
                text: "Count",
                style: { fontSize: "10px", fontWeight: 400 },
            },
            labels: {
                style: { fontSize: "10px" },
            }
        },
        colors: ["#00E396", "#FEB019", "#FF4560", "#775DD0"],
        legend: {
            position: "bottom",
            horizontalAlign: "center",
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}`,
            },
        },
    }

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Confusion Matrix</CardTitle>
                    <CardDescription>Confusion matrix metrics grouped by model</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">Loading chart...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Confusion Matrix</CardTitle>
                        <CardDescription>Confusion matrix metrics grouped by model</CardDescription>
                    </div>
                    <ChartMenu chartId={chartId} />
                </CardHeader>
                <CardContent>
                    <Chart options={options} series={series} type="bar" height={300} />
                </CardContent>
            </Card>
        </>
    )
}

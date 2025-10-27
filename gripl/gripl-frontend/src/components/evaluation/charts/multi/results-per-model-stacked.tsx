"use client"

import dynamic from "next/dynamic"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import type ApexCharts from "apexcharts"
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import ChartMenu from "@/components/evaluation/charts/common/chart-menu";
import {useEffect, useState} from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ResultsPerModelStackedProps {
    reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }>
}

export function ResultsPerModelStacked({ reportSummaries }: ResultsPerModelStackedProps) {
    const [isClient, setIsClient] = useState(false)
    const chartId = "results-per-model-stacked-chart"

    useEffect(() => {
        setIsClient(true)
    }, [])

    const series = [
        {
            name: "Passed",
            data: reportSummaries.map((r) => r.summary.passed),
        },
        {
            name: "Failed",
            data: reportSummaries.map((r) => r.summary.failed),
        },
        {
            name: "Error",
            data: reportSummaries.map((r) => r.summary.error),
        },
    ]

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: chartId,
            type: "bar",
            stacked: true,
            toolbar: { show: false },
            animations: { enabled: false}
        },
        plotOptions: {
            bar: {
                horizontal: false,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: "10px",
                            fontWeight: 900,
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: true,
        },
        xaxis: {
            categories: reportSummaries.map((r) => r.label),
            labels: {
                rotate: -42,
                rotateAlways: true,
                style: { fontSize: "10px" }
            },
        },
        yaxis: {
            title: {
                text: "Number of Test Cases",
                style: { fontSize: "10px", fontWeight: 400 },
            },
            labels: {
                style: {fontSize: "10px"},
            }
        },
        colors: ["#22c55e", "#ef4444", "#f97316"],
        legend: {
            position: "bottom",
            horizontalAlign: "center",
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} tests`,
            },
        },
    }

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Test Case Results</CardTitle>
                    <CardDescription>Test case outcomes stacked by result type</CardDescription>
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
                        <CardTitle>Test Case Results</CardTitle>
                        <CardDescription>Test case outcomes stacked by result type</CardDescription>
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

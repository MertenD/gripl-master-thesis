"use client"

import dynamic from "next/dynamic"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import type ApexCharts from "apexcharts"
import ChartMenu from "@/components/evaluation/charts/common/chart-menu";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import {useEffect, useState} from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface AmountOfRetriesPerModelProps {
    reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }>
}

export function AmountOfRetriesPerModel({ reportSummaries }: AmountOfRetriesPerModelProps) {

    const [isClient, setIsClient] = useState(false)

    const chartId = "amount-of-retries-chart"
    const series = [
        {
            name: "Amount of Retries",
            data: reportSummaries.map((r) => r.summary.amountOfRetries || 0),
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
                columnWidth: "55%",
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
                style: { fontSize: "10px" },
            },
        },
        yaxis: {
            title: {
                text: "Number of Retries",
                style: { fontSize: "10px", fontWeight: 400 },
            },
            labels: { style: { fontSize: "10px" } },
        },
        colors: ["#fb923c"],
        tooltip: {
            y: {
                formatter: (val) => `${val} retries`,
            },
        },
    }

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Amount of Retries</CardTitle>
                    <CardDescription>Number of retries required per model all test cases</CardDescription>
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
                        <CardTitle>Amount of Retries</CardTitle>
                        <CardDescription>Number of retries required per model over {reportSummaries[0].summary.total} test cases</CardDescription>
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

"use client"

import {useEffect, useState} from "react"
import dynamic from "next/dynamic"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import type ApexCharts from "apexcharts"
import {AggregatedEvaluationResults} from "@/models/evaluation/AggregatedEvaluationResult";
import {getModelColor, useColors} from "@/components/evaluation/charts/common/color-context";
import ChartMenu from "@/components/evaluation/charts/common/chart-menu";
import ColorConfigDialog from "@/components/evaluation/charts/common/color-config-dialog";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface MetricChartProps {
    title: string
    description: string
    metricKey: "avgPrecision" | "avgRecall" | "avgF1Score" | "avgAccuracy" | "avgAmountOfRetries"
    stdKey: "stdPrecision" | "stdRecall" | "stdF1Score" | "stdAccuracy" | "stdAmountOfRetries"
    aggregatedEvaluationResults: AggregatedEvaluationResults
    xAxisMaxOffset?: number
}

interface ModelData {
    name: string
    mean: number
    sd: number
    color: string
}

export default function MetricChart({ title, description, metricKey, stdKey, aggregatedEvaluationResults, xAxisMaxOffset }: MetricChartProps) {
    const [isClient, setIsClient] = useState(false)
    const { colors } = useColors()
    const [showColorDialog, setShowColorDialog] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const data: ModelData[] = Object.entries(aggregatedEvaluationResults).map(([name, metrics]) => ({
        name,
        mean: metrics[metricKey] || 0,
        sd: metrics[stdKey] || 0,
        color: getModelColor(name, colors),
    }))

    const chartId = `metric-chart-${metricKey}`

    const maxValue = Math.max(...data.map((d) => d.mean + d.sd))
    const xAxisMax = maxValue + (xAxisMaxOffset || 0.2)

    const categories = data.map((d) => d.name)
    const chartColors = data.map((d) => getModelColor(d.name, colors))

    const series = [
        {
            name: title,
            data: data.map((d) => d.mean),
        },
    ]

    const options: ApexCharts.ApexOptions = {
        chart: {
            id: chartId,
            type: "bar",
            height: 100,
            toolbar: { show: false },
            animations: { enabled: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                barHeight: "70%",
                dataLabels: { position: "top" },
            },
        },
        colors: chartColors,
        dataLabels: {
            enabled: true,
            formatter: (_val, opts) => {
                const d = data[opts.dataPointIndex]
                return `${d.mean.toFixed(3)} ± ${d.sd.toFixed(3)}`
            },
            offsetY: 0,
            offsetX: 40,
            style: { fontSize: "11px", colors: ["#000000"] },
            background: { enabled: false },
        },
        xaxis: {
            categories,
            max: xAxisMax,
            min: 0,
            title: {
                text: `${title} (mean ± SD)`,
                style: { fontSize: "10px", fontWeight: 400 },
            },
            labels: { style: { fontSize: "10px" } },
            axisBorder: { show: true, color: "#000000" },
            axisTicks: { show: true },
        },
        yaxis: {
            labels: {
                style: { fontSize: "10px" },
                maxWidth: 300
            },
            axisBorder: { show: true, color: "#000000" },
        },
        grid: {
            borderColor: "#e0e0e0",
            strokeDashArray: 4,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: false } },
        },
        legend: { show: false },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => val.toFixed(3),
                title: {
                    formatter: () => `${title}: `,
                },
            },
        },
    }

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
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
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </div>
                        <ChartMenu chartId={chartId} onColorConfig={() => setShowColorDialog(true)} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Chart options={options} series={series} type="bar" height={300} />
                </CardContent>
            </Card>
            <ColorConfigDialog open={showColorDialog} onOpenChange={setShowColorDialog} modelLabels={Object.keys(aggregatedEvaluationResults)} />
        </>
    )
}

"use client"

import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {modelPalette} from "../common/palettes";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function PerformanceMetricsBarsMulti({
   items,
}: {
    items: Array<{ label: string; summary: EvaluationReportSummary }>;
}) {
    const data = [
        { metric: "Accuracy", ...Object.fromEntries(items.map(({ label, summary }) => [label, summary.accuracy])) },
        { metric: "Precision", ...Object.fromEntries(items.map(({ label, summary }) => [label, summary.precision])) },
        { metric: "Recall", ...Object.fromEntries(items.map(({ label, summary }) => [label, summary.recall])) },
        { metric: "F1-Score", ...Object.fromEntries(items.map(({ label, summary }) => [label, summary.f1Score])) },
    ];

    return <ChartContainer title="Performance Metrics — Side by Side">
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip content={<UniversalTooltip isPercentage={true}/>} wrapperStyle={{ zIndex: 100 }} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                // Legens entrysh should have the same order than bars
                // itemSorter Type: itemSorter?: 'value' | 'dataKey' | ((item: LegendPayload) => number | string);
                // itemSorter usage: (itemSorter ? sortBy(payload, itemSorter) : payload)
                <Legend itemSorter={(item) => {
                    return items.findIndex(({ label }) => label === item.value);
                }} />
                {items.map(({ label }, idx) => (
                    <Bar key={label} dataKey={label} name={label} radius={[4,4,0,0]} fill={modelPalette[idx % modelPalette.length]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
}

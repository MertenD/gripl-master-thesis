import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {modelPalette} from "../common/palettes";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function ConfusionMatrixBarsMulti({
    items,
}: {
    items: Array<{ label: string; summary: EvaluationReportSummary }>;
}) {
    const data = [
        Object.fromEntries([["name","True Positives"], ...items.map(({label,summary})=>[label, summary.totalTruePositives])]),
        Object.fromEntries([["name","False Positives"], ...items.map(({label,summary})=>[label, summary.totalFalsePositives])]),
        Object.fromEntries([["name","False Negatives"], ...items.map(({label,summary})=>[label, summary.totalFalseNegatives])]),
        Object.fromEntries([["name","True Negatives"], ...items.map(({label,summary})=>[label, summary.totalTrueNegatives])]),
    ] as Array<Record<string, number | string>>;

    return <ChartContainer title="Confusion Matrix — per Model">
        <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<UniversalTooltip />} wrapperStyle={{ zIndex: 100 }} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                {items.map(({ label }, idx) => (
                    <Bar key={label} dataKey={label} name={label} radius={[4,4,0,0]} fill={modelPalette[idx % modelPalette.length]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
}

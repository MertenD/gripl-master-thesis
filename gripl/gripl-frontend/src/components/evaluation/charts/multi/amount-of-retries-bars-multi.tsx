import {EvaluationReportSummary} from "@/models/dto/ReportData";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {mergeEvalColors, modelPalette} from "@/components/evaluation/charts/common/palettes";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import React from "react";
import ChartContainer from "@/components/evaluation/charts/chart-container";
import {getEvaluationColors} from "@/lib/chart-colors";


export default function AmountOfRetriesBarsMulti({
    items,
}: {
    items: Array<{ label: string; summary: EvaluationReportSummary }>;
}) {

    const colors = mergeEvalColors(getEvaluationColors);
    const data = items.map(({ label, summary }) => ({
        model: label,
        amountOfRetries: summary.amountOfRetries,
    }))

    return <ChartContainer title="Amount of Retries — per Model">
        <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" tick={{ fontSize:12 }} interval={0}  angle={-30} textAnchor="end" height={110} />
                <YAxis />
                <Tooltip content={<UniversalTooltip />} wrapperStyle={{ zIndex: 100 }} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                <Legend />
                <Bar name="Amount of Retries" dataKey="amountOfRetries" radius={[4,4,0,0]} fill={colors.error} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
}
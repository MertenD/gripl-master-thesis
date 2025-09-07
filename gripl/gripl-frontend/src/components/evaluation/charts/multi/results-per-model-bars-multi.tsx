import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {mergeEvalColors} from "../common/palettes";
import {getEvaluationColors} from "@/lib/chart-colors";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function ResultsPerModelBarsMulti({
   items,
}: {
    items: Array<{ label: string; summary: EvaluationReportSummary }>;
}) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = items.map(({ label, summary }) => ({
        model: label,
        Passed: summary.passed,
        Failed: summary.failed,
        Error: summary.error,
    }));

    return <ChartContainer title="Results per Model (Stacked)">
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip content={<UniversalTooltip />} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                <Legend />
                <Bar dataKey="Passed" stackId="a" radius={[4,4,0,0]} fill={colors.passed} />
                <Bar dataKey="Failed" stackId="a" fill={colors.failed} />
                <Bar dataKey="Error"  stackId="a" fill={colors.error} />
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
}

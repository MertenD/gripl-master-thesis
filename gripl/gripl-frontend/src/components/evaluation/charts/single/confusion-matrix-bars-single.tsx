import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {mergeEvalColors} from "../common/palettes";
import {getEvaluationColors} from "@/lib/chart-colors";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function ConfusionMatrixBarsSingle({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { name: "True Positives",  value: summary.totalTruePositives,  color: colors.truePositive },
        { name: "False Positives", value: summary.totalFalsePositives, color: colors.falsePositive },
        { name: "False Negatives", value: summary.totalFalseNegatives, color: colors.falseNegative },
        { name: "True Negatives",  value: summary.totalTrueNegatives,  color: colors.trueNegative },
    ];

    return <ChartContainer title="Confusion Matrix Breakdown">
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip content={<UniversalTooltip />} wrapperStyle={{ zIndex: 100 }} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                    {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </ChartContainer>
}

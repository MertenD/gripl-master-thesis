import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";
import { mergeEvalColors } from "../common/palettes";
import { getEvaluationColors } from "@/lib/chart-colors";
import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";

export default function MetricsBars({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { name: "Accuracy",  value: summary.accuracy,  color: colors.accuracy },
        { name: "Precision", value: summary.precision, color: colors.precision },
        { name: "Recall",    value: summary.recall,    color: colors.recall },
        { name: "F1-Score",  value: summary.f1Score,   color: colors.f1Score },
    ];

    return (
        <Card>
            <CardHeader><CardTitle>Performance Metrics Comparison</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 1]} tickFormatter={(v)=>`${(v*100).toFixed(0)}%`} />
                        <Tooltip content={<UniversalTooltip isPercentage={true} />} cursor={{ fill: "hsl(var(--card-foreground))", fillOpacity: 0.1 }}/>
                        <Bar dataKey="value" radius={[4,4,0,0]}>
                            {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

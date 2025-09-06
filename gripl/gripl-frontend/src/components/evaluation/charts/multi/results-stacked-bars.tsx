import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { mergeEvalColors } from "../common/palettes";
import { getEvaluationColors } from "@/lib/chart-colors";
import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";

export default function ResultsStackedBars({
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

    return (
        <Card>
            <CardHeader><CardTitle>Results per Model (Stacked)</CardTitle></CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    );
}

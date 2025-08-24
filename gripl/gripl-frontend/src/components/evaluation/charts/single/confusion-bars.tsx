import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";
import { mergeEvalColors } from "../common/palettes";
import { getEvaluationColors } from "@/lib/chart-colors";
import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";

export default function ConfusionBars({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { name: "True Positives",  value: summary.totalTruePositives,  color: colors.truePositive },
        { name: "False Positives", value: summary.totalFalsePositives, color: colors.falsePositive },
        { name: "False Negatives", value: summary.totalFalseNegatives, color: colors.falseNegative },
        { name: "True Negatives",  value: summary.totalTrueNegatives,  color: colors.trueNegative },
    ];

    return (
        <Card>
            <CardHeader><CardTitle>Confusion Matrix Breakdown</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top:20, right:30, left:20, bottom:5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip content={<UniversalTooltip />} />
                        <Bar dataKey="value" radius={[4,4,0,0]}>
                            {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { mergeEvalColors } from "../common/palettes";
import { getEvaluationColors } from "@/lib/chart-colors";
import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";

export default function TestResultsPie({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { name: "Passed", value: summary.passed, color: colors.passed },
        { name: "Failed", value: summary.failed, color: colors.failed },
        { name: "Error",  value: summary.error,  color: colors.error  },
    ].filter(d => d.value > 0);

    return (
        <Card>
            <CardHeader><CardTitle>Test Results Distribution</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false}
                             label={({ name, value, percent }) => `${name}: ${value} (${((percent||0)*100).toFixed(0)}%)`}>
                            {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip content={<UniversalTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

"use client"

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {mergeEvalColors} from "../common/palettes";
import {getEvaluationColors} from "@/lib/chart-colors";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function TestResultDistributionPieSingle({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { name: "Passed", value: summary.passed, color: colors.passed },
        { name: "Failed", value: summary.failed, color: colors.failed },
        { name: "Error",  value: summary.error,  color: colors.error  },
    ].filter(d => d.value > 0);

    return <ChartContainer title="Test Results Distribution">
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false}
                     label={({ name, value, percent }) => `${name}: ${value} (${((percent||0)*100).toFixed(0)}%)`}>
                    {data.map((e,i)=><Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<UniversalTooltip />} wrapperStyle={{ zIndex: 100 }} />
            </PieChart>
        </ResponsiveContainer>
    </ChartContainer>
}

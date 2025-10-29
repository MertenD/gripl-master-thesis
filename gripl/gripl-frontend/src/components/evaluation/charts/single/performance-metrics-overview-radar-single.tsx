"use client"

import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip} from "recharts";
import {mergeEvalColors} from "../common/palettes";
import {getEvaluationColors} from "@/lib/chart-colors";
import React from "react";
import {EvaluationReportSummary} from "@/models/dto/ReportData";
import UniversalTooltip from "@/components/evaluation/charts/common/universal-tooltip";
import ChartContainer from "@/components/evaluation/charts/chart-container";

export default function PerformanceMetricsOverviewRadarSingle({ summary }: { summary: EvaluationReportSummary }) {
    const colors = mergeEvalColors(getEvaluationColors);
    const data = [
        { metric: "Accuracy", value: summary.accuracy * 100, fullMark: 100 },
        { metric: "Precision", value: summary.precision * 100, fullMark: 100 },
        { metric: "Recall",    value: summary.recall * 100,    fullMark: 100 },
        { metric: "F1-Score",  value: summary.f1Score * 100,   fullMark: 100 },
    ];

    return <ChartContainer title="Performance Metrics Overview">
        <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v)=>`${v}%`} />
                <Radar name="Metrics" dataKey="value" stroke={colors.accuracy} fill={colors.accuracy} fillOpacity={0.3} strokeWidth={2} />
                <Tooltip content={<UniversalTooltip isPercentage={true}/>} wrapperStyle={{ zIndex: 100 }} />
            </RadarChart>
        </ResponsiveContainer>
    </ChartContainer>
}

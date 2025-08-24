import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import ResultsStackedBars from "@/components/evaluation/charts/multi/results-stacked-bars";
import ConfusionGroupedBars from "@/components/evaluation/charts/multi/confusion-grouped-bars";
import TestResultsPie from "@/components/evaluation/charts/single/test-results-pie";
import RadarMetrics from "@/components/evaluation/charts/single/radar-metrics";
import MetricsBars from "@/components/evaluation/charts/single/metrics-bars";
import ConfusionBars from "@/components/evaluation/charts/single/confusion-bars";
import MetricsGroupedBars from "@/components/evaluation/charts/multi/metrics-grouped-bars";

type SingleProps = { reportSummary: EvaluationReportSummary; reportSummaries?: undefined };
type MultiProps  = { reportSummary?: undefined; reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }> };
type Props = SingleProps | MultiProps;

export default function MetricsCharts(props: Props) {
    if ("reportSummaries" in props && props.reportSummaries) {
        const items = props.reportSummaries;
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MetricsGroupedBars items={items} />
                <ResultsStackedBars items={items} />
                <ConfusionGroupedBars items={items} />
            </div>
        );
    }

    const { reportSummary } = props as SingleProps;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TestResultsPie summary={reportSummary} />
            <RadarMetrics summary={reportSummary} />
            <MetricsBars summary={reportSummary} />
            <ConfusionBars summary={reportSummary} />
        </div>
    );
}

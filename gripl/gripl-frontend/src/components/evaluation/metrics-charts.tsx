import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import ResultsPerModelBarsMulti from "@/components/evaluation/charts/multi/results-per-model-bars-multi";
import ConfusionMatrixBarsMulti from "@/components/evaluation/charts/multi/confusion-matrix-bars-multi";
import TestResultDistributionPieSingle from "@/components/evaluation/charts/single/test-result-distribution-pie-single";
import PerformanceMetricsOverviewRadarSingle from "@/components/evaluation/charts/single/performance-metrics-overview-radar-single";
import PerformanceMetricsBarsSingle from "@/components/evaluation/charts/single/performance-metrics-bars-single";
import ConfusionMatrixBarsSingle from "@/components/evaluation/charts/single/confusion-matrix-bars-single";
import PerformanceMetricsBarsMulti from "@/components/evaluation/charts/multi/performance-metrics-bars-multi";

type SingleProps = { reportSummary: EvaluationReportSummary; reportSummaries?: undefined };
type MultiProps  = { reportSummary?: undefined; reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }> };
type Props = SingleProps | MultiProps;

export default function MetricsCharts(props: Props) {
    if ("reportSummaries" in props && props.reportSummaries) {
        const items = props.reportSummaries;
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceMetricsBarsMulti items={items} />
                <ResultsPerModelBarsMulti items={items} />
                <ConfusionMatrixBarsMulti items={items} />
            </div>
        );
    }

    const { reportSummary } = props as SingleProps;
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TestResultDistributionPieSingle summary={reportSummary} />
            <PerformanceMetricsOverviewRadarSingle summary={reportSummary} />
            <PerformanceMetricsBarsSingle summary={reportSummary} />
            <ConfusionMatrixBarsSingle summary={reportSummary} />
        </div>
    );
}

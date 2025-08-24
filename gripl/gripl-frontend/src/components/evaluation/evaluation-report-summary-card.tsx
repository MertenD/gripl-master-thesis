import React from "react";
import { EvaluationReportSummary } from "@/models/dto/ReportData";
import EvaluationReportSummaryCardSingle from "./evaluation-report-summary-card-single";
import EvaluationReportSummaryCardMulti from "@/components/evaluation/evaluation-report-summary-card-multi";

type SingleProps = { reportSummary: EvaluationReportSummary; reportSummaries?: undefined };
type MultiProps  = { reportSummary?: undefined; reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }> };
type Props = SingleProps | MultiProps;

export default function EvaluationReportSummaryCard(props: Props) {
    if ("reportSummaries" in props && props.reportSummaries) {
        return <EvaluationReportSummaryCardMulti items={props.reportSummaries} />;
    }
    return <EvaluationReportSummaryCardSingle reportSummary={(props as SingleProps).reportSummary} />;
}

import React from "react";
import {EvaluationMetadataReport, EvaluationReportSummary} from "@/models/dto/ReportData";
import EvaluationReportSummaryCardSingle from "./evaluation-report-summary-card-single";
import EvaluationReportSummaryCardMulti from "@/components/evaluation/evaluation-report-summary-card-multi";

type SingleProps = { reportSummary: EvaluationReportSummary; reportSummaries?: undefined };
type MultiProps  = { reportSummary?: undefined; reportSummaries: Array<{ label: string; summary: EvaluationReportSummary }>, metadata: EvaluationMetadataReport | null };
type Props = SingleProps | MultiProps;

export default function EvaluationReportSummaryCard(props: Props) {
    if ("reportSummaries" in props && props.reportSummaries) {
        return <EvaluationReportSummaryCardMulti items={props.reportSummaries} metadata={props.metadata} />;
    }
    return <EvaluationReportSummaryCardSingle reportSummary={(props as SingleProps).reportSummary} />;
}

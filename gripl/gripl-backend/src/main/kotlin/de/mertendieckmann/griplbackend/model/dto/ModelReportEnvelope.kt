package de.mertendieckmann.griplbackend.model.dto

data class ModelReportEnvelope(
    val modelLabel: String,
    val report: EvaluationReport,
    val runNumber: Int = 1
)
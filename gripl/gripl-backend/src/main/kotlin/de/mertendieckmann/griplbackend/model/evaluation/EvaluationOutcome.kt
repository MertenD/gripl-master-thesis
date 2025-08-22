package de.mertendieckmann.griplbackend.model.evaluation

import de.mertendieckmann.griplbackend.model.dto.EvaluationReportError
import de.mertendieckmann.griplbackend.model.dto.TestCaseReport

sealed interface EvaluationOutcome {
    data class Success(
        val testCaseReport: TestCaseReport,
        val metrics: EvaluationMetrics
    ) : EvaluationOutcome

    data class Error(
        val errorReport: EvaluationReportError
    ) : EvaluationOutcome
}
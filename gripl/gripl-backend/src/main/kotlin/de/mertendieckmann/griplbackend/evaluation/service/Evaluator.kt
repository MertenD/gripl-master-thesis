package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ModelRunConfig
import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import kotlin.jvm.Throws

interface Evaluator {

    /**
     * Evaluates the given BPMN XML using the specified evaluation request.
     * Returns a pair containing a list of expected values and an optional integer representing the amount of retries
     * if the evaluator implements retry logic (e.g., for AI-based evaluators) and if a retry was necessary.
     */
    @Throws(Exception::class)
    suspend fun evaluate(bpmnXml: String, evaluationRequest: EvaluationRequest): Pair<List<ExpectedValue>, Int?>
}
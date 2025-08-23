package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ModelRunConfig
import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import kotlin.jvm.Throws

interface Evaluator {
    @Throws(Exception::class)
    suspend fun evaluate(bpmnXml: String, evaluationRequest: EvaluationRequest): List<ExpectedValue>
}
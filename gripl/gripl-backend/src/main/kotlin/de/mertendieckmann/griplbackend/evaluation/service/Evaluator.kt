package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import org.springframework.web.reactive.function.client.WebClient
import kotlin.jvm.Throws

interface Evaluator {
    @Throws(Exception::class)
    suspend fun evaluate(bpmnXml: String, evaluationRequest: EvaluationRequest): List<ExpectedValue>
}
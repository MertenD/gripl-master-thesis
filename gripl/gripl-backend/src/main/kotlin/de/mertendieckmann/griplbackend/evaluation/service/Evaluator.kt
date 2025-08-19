package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import org.springframework.web.reactive.function.client.WebClient
import kotlin.jvm.Throws

interface Evaluator {
    @Throws(Exception::class)
    suspend fun evaluate(bpmnXml: String, endpoint: String): List<ExpectedValue>
}
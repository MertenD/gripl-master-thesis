package de.mertendieckmann.griplbackend.model.dto

import de.mertendieckmann.griplbackend.config.LlmConfig

data class EvaluationRequest(
    val evaluationEndpoint: String = "/gdpr/analysis/basic",
    var llmProps: LlmConfig.Companion.LlmPropsOverride? = null,
    val maxConcurrent: Int = 4,
    val datasets: List<Int>
) {
    override fun toString(): String =
        "EvaluationRequest(evaluationEndpoint=$evaluationEndpoint, llmProps=${llmProps?.copy(apiKey = llmProps?.apiKey?.let { "\"****\"" })})"
}
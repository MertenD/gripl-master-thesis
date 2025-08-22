package de.mertendieckmann.griplbackend.model.dto

import de.mertendieckmann.griplbackend.config.LlmConfig

data class EvaluationRequest(
    val evaluationEndpoint: String = "/gdpr/analysis/basic",
    var llmProps: LlmConfig.Companion.LlmProps = LlmConfig.Companion.LlmProps()
) {
    init {
        llmProps = llmProps.copy().apply {
            if (baseUrl.isNullOrBlank()) baseUrl = LlmConfig.Companion.LlmProps().baseUrl
            if (modelName.isNullOrBlank()) modelName = LlmConfig.Companion.LlmProps().modelName
            if (apiKey.isNullOrBlank()) apiKey = LlmConfig.Companion.LlmProps().apiKey
            if (timeoutSeconds == 0L) timeoutSeconds = LlmConfig.Companion.LlmProps().timeoutSeconds
        }
    }
}
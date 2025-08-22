package de.mertendieckmann.griplbackend.application.factory

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.config.LlmConfig.Companion.LlmProps
import org.springframework.stereotype.Component

@Component
class AnalyzerFactory(
    private val llmConfig: LlmConfig
){
    fun create(llmProps: LlmProps): BpmnAnalyzer {
        val llm = llmConfig.getOpenAiChatModel(llmProps)
        return BpmnAnalyzer(llm)
    }
}
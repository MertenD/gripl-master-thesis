package de.mertendieckmann.griplbackend.application.analyzer

import dev.langchain4j.model.chat.ChatModel
import org.springframework.stereotype.Component

@Component
class AnalyzerFactory {
    fun createPromptEngineeringAnalyzer(chatModel: ChatModel): PromptBpmnAnalyzer {
        return PromptBpmnAnalyzer(chatModel)
    }

    fun createBaselineAnalyzer(chatModel: ChatModel): BaselineBpmnAnalyzer {
        return BaselineBpmnAnalyzer(chatModel)
    }
}
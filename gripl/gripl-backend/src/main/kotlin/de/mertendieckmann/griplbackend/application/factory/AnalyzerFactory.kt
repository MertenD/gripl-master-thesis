package de.mertendieckmann.griplbackend.application.factory

import de.mertendieckmann.griplbackend.application.analyzer.BaselineBpmnAnalyzer
import de.mertendieckmann.griplbackend.application.analyzer.PromptBpmnAnalyzer
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
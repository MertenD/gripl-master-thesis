package de.mertendieckmann.griplbackend.application.factory

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.config.LlmConfig.Companion.LlmProps
import dev.langchain4j.model.chat.ChatModel
import org.springframework.stereotype.Component

@Component
class AnalyzerFactory {
    fun create(chatModel: ChatModel): BpmnAnalyzer {
        return BpmnAnalyzer(chatModel)
    }
}
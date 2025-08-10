package de.mertendieckmann.griplbackend.application.factory

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import dev.langchain4j.model.chat.ChatModel
import org.springframework.stereotype.Component

@Component
class AnalyzerFactory(
    private val llm: ChatModel
) {
    fun create() = BpmnAnalyzer(llm)
}
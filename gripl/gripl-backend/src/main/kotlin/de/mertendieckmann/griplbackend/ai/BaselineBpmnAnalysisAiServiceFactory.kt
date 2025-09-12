package de.mertendieckmann.griplbackend.ai

import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.service.AiServices

object BaselineBpmnAnalysisAiServiceFactory {

    fun create(llm: ChatModel): BaselineBpmnAnalysisAiService {
        return AiServices
            .builder(BaselineBpmnAnalysisAiService::class.java)
            .chatModel(llm)
            .systemMessageProvider { getPrompt() }
            .build()
    }

    private fun getPrompt(): String {
        return """ 
            Your task is to identify and return a list of the IDs of all Activity (Task) elements that process personal data. 
            Ignore all other element types.
        """.trimIndent()
    }
}
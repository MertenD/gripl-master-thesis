package de.mertendieckmann.griplbackend.chat

import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.openai.OpenAiChatModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class LlmConfig {

    @Value("\${openai.api-key}")
    lateinit var apiKey: String

    @Value("\${openai.model-name:gpt-3.5-turbo}")
    lateinit var modelName: String

    @Value("\${openai.api.url:https://api.openai.com/v1}")
    lateinit var apiUrl: String

    @Bean
    fun openAiChatModel(): ChatModel {
        return OpenAiChatModel.builder()
            .apiKey(apiKey)
            .modelName(modelName)
            .baseUrl(apiUrl)
            .build()
    }
}
package de.mertendieckmann.griplbackend.config

import dev.langchain4j.http.client.jdk.JdkHttpClient
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.openai.OpenAiChatModel
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.net.http.HttpClient
import java.time.Duration

@Configuration
class LlmConfig(
    @Value("\${llm.api-key}") private val openAiApiKey: String
) {

    fun getOpenAiChatModel(props: LlmProps): ChatModel {
        val httpClientBuilder = JdkHttpClient.builder()
            .httpClientBuilder(HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofMinutes(props.timeoutSeconds))
            )

        return OpenAiChatModel.builder()
            .modelName(props.modelName)
            .baseUrl(props.baseUrl)
            .apiKey(props.apiKey ?: openAiApiKey)
            .httpClientBuilder(httpClientBuilder)
            .timeout(Duration.ofSeconds(props.timeoutSeconds))
            .logRequests(true)
            .build()
    }

    companion object {

        @ConfigurationProperties(prefix = "llm")
        data class LlmProps(
            var modelName: String? = "gpt-3.5-turbo",
            var baseUrl: String? = "https://api.openai.com/v1",
            var apiKey: String? = null,
            var timeoutSeconds: Long = 240L
        )
    }
}
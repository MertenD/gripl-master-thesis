package de.mertendieckmann.griplbackend.config

import dev.langchain4j.http.client.jdk.JdkHttpClient
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.openai.OpenAiChatModel
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.net.http.HttpClient
import java.time.Duration

@Configuration
class LlmConfig(private val defaultProps: LlmProps) {

    fun buildWithOverride(override: LlmPropsOverride?): ChatModel =
        getOpenAiChatModel(defaultProps.withOverride(override))

    fun getOpenAiChatModel(props: LlmProps): ChatModel {
        val httpClientBuilder = JdkHttpClient.builder()
            .httpClientBuilder(
                HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .connectTimeout(Duration.ofSeconds(props.timeoutSeconds))
            )

        return OpenAiChatModel.builder()
            .modelName(props.modelName)
            .baseUrl(props.baseUrl)
            .apiKey(props.apiKey)
            .httpClientBuilder(httpClientBuilder)
            .timeout(Duration.ofSeconds(props.timeoutSeconds))
            .logRequests(true)
            .logResponses(true)
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

        data class LlmPropsOverride(
            var baseUrl: String? = null,
            var modelName: String? = null,
            var apiKey: String? = null,
            var timeoutSeconds: Long? = null
        )

        fun LlmProps.withOverride(override: LlmPropsOverride?): LlmProps =
            if (override == null) this else copy(
                modelName      = override.modelName?.takeIf { it.isNotBlank() } ?: modelName,
                baseUrl        = override.baseUrl?.takeIf { it.isNotBlank() } ?: baseUrl,
                apiKey         = override.apiKey?.takeIf { it.isNotBlank() } ?: apiKey,
                timeoutSeconds = override.timeoutSeconds ?: timeoutSeconds
            )
    }
}
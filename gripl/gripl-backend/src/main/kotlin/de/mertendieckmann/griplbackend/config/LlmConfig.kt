package de.mertendieckmann.griplbackend.config

import dev.langchain4j.http.client.jdk.JdkHttpClient
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.chat.listener.ChatModelListener
import dev.langchain4j.model.chat.listener.ChatModelRequestContext
import dev.langchain4j.model.chat.listener.ChatModelResponseContext
import dev.langchain4j.model.chat.request.ResponseFormat
import dev.langchain4j.model.openai.OpenAiChatModel
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.net.http.HttpClient
import java.time.Duration

@Configuration
class LlmConfig(private val defaultProps: LlmProps) {

    fun buildStrictJsonModelWithOverride(override: LlmPropsOverride?): ChatModel =
        getStrictJsonOpenAiChatModel(defaultProps.withOverride(override))

    fun getStrictJsonOpenAiChatModel(props: LlmProps): ChatModel {
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
            .listeners(listOf(usageListener))
            .temperature(props.temperature)
            .topP(props.topP)
            .seed(props.seed)
            .responseFormat(ResponseFormat.JSON.toString())
            .build()
    }

    companion object {

        private val log = KotlinLogging.logger { }

        @ConfigurationProperties(prefix = "llm")
        data class LlmProps(
            var modelName: String? = "gpt-3.5-turbo",
            var baseUrl: String? = "https://api.openai.com/v1",
            var apiKey: String? = null,
            var timeoutSeconds: Long = 240L,
            var temperature: Double? = null,
            var topP: Double? = null,
            var seed: Int? = null
        )

        data class LlmPropsOverride(
            var baseUrl: String? = null,
            var modelName: String? = null,
            var apiKey: String? = null,
            var timeoutSeconds: Long? = null,
            var temperature: Double? = null,
            var topP: Double? = null,
            var seed: Int? = null
        )

        fun LlmProps.withOverride(override: LlmPropsOverride?): LlmProps =
            if (override == null) this else copy(
                modelName      = override.modelName?.takeIf { it.isNotBlank() } ?: modelName,
                baseUrl        = override.baseUrl?.takeIf { it.isNotBlank() } ?: baseUrl,
                apiKey         = override.apiKey?.takeIf { it.isNotBlank() } ?: apiKey,
                timeoutSeconds = override.timeoutSeconds ?: timeoutSeconds,
                temperature     = override.temperature ?: temperature,
                topP           = override.topP ?: topP,
                seed           = override.seed ?: seed
            )

        val usageListener = object : ChatModelListener {
            override fun onRequest(context: ChatModelRequestContext) {
                context.attributes()["t0"] = System.nanoTime()
            }
            override fun onResponse(context: ChatModelResponseContext) {
                val t0 = context.attributes()["t0"] as? Long ?: return
                val latencyMs = (System.nanoTime() - t0) / 1_000_000.0
                val meta = context.chatResponse().metadata()
                val usage = meta.tokenUsage()
                val inputTokens  = usage?.inputTokenCount() ?: 0
                val outputTokens = usage?.outputTokenCount() ?: 0
                val totalTokens  = usage?.totalTokenCount() ?: (inputTokens + outputTokens)
                log.info { "LLM [${meta.modelName()}] $latencyMs ms, tokens $inputTokens/$outputTokens/$totalTokens" }
            }
        }
    }
}
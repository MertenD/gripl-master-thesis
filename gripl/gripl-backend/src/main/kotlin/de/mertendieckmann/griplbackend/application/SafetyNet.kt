package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.JsonFixAiServiceFactory
import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult
import dev.langchain4j.memory.chat.ChatMemoryProvider
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.service.output.OutputParsingException
import io.github.oshai.kotlinlogging.KotlinLogging

class SafetyNet(
    llm: ChatModel,
    memoryProvider: ChatMemoryProvider
) {
    private val log = KotlinLogging.logger { }
    private val jsonFixAiService = JsonFixAiServiceFactory.create(llm, memoryProvider)

    /**
     * Tries to execute the given [block] that produces a [BpmnAnalysisResult].
     * If an [OutputParsingException] occurs, it will attempt to fix the JSON output using the [jsonFixAiService]
     * and retry up to [maxRetries] times. The [sessionId] is used to maintain context in the AI service.
     * Returns a pair of the successfully parsed [BpmnAnalysisResult] and the number of retries it took.
     */
    fun safeGuardAnalysisResultParsing(
        sessionId: String,
        maxRetries: Int,
        block: () -> BpmnAnalysisResult
    ): Pair<BpmnAnalysisResult, Int> {
        require(maxRetries >= 0) { "maxRetries must be >= 0" }

        return try {
            Pair(block(), 0)
        } catch (original: OutputParsingException) {
            var lastError: Throwable = original

            repeat(maxRetries) {
                log.warn(lastError) { "Parsing failed. Attempting to fix JSON and retry... (Attempt ${it + 1} of $maxRetries)" }
                try {
                    // The JSON fix service will use the same sessionId as the original request to have access to the same conversation memory
                    return Pair(jsonFixAiService.fixAnalysisResultJson(
                        sessionId = sessionId,
                        lastError.stackTraceToString(),
                    ), it + 1)
                } catch (fixError: Throwable) {
                    lastError = fixError
                }
            }

            throw lastError
        }
    }
}
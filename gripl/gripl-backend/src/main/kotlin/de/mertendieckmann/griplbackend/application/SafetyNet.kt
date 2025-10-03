package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.JsonFixAiServiceFactory
import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.service.output.OutputParsingException

class SafetyNet(
    llm: ChatModel
) {
    private val jsonFixAiService = JsonFixAiServiceFactory.create(llm)

    fun safeGuardAnalysisResultParsing(
        maxRetries: Int,
        block: () -> BpmnAnalysisResult
    ): BpmnAnalysisResult {
        require(maxRetries >= 0) { "maxRetries must be >= 0" }

        return try {
            block()
        } catch (original: OutputParsingException) {
            var lastError: Throwable = original

            repeat(maxRetries) {
                try {
                    return jsonFixAiService.fixAnalysisResultJson(lastError.stackTraceToString())
                } catch (fixError: Throwable) {
                    if (fixError.stackTraceToString().startsWith("dev.langchain4j.service.output.OutputParsingException: Failed to parse \"\" into")) {
                        throw fixError
                    }
                    lastError = fixError
                }
            }

            throw lastError
        }
    }
}
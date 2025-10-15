package de.mertendieckmann.griplbackend.application.analyzer

import de.mertendieckmann.griplbackend.ai.PromptBpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.ai.SharedChatMemoryProvider
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.application.SafetyNet
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging
import java.util.*

class PromptBpmnAnalyzer(
    llm: ChatModel
): BpmnAnalyzer {
    private val log = KotlinLogging.logger { }
    private val memoryProvider = SharedChatMemoryProvider(50)
    private val bpmnAnalysisAiService = PromptBpmnAnalysisAiServiceFactory.create(llm, memoryProvider)
    private val safetyNet = SafetyNet(llm, memoryProvider)

    override fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse {
        val sessionId = UUID.randomUUID().toString()

        val bpmnElements = BpmnExtractor().extractBpmnElements(bpmnXml)

        val result = safetyNet.safeGuardAnalysisResultParsing(
            sessionId = sessionId,
            maxRetries = 3,
        ) {
            bpmnAnalysisAiService.analyze(sessionId, bpmnElements)
        }

        val analysisResult = result.first.resolveActivities(bpmnElements)
        val amountOfRetries = result.second

        log.info { "BPMN Analysis Result: $analysisResult" }

        return AnalysisResponse.fromBpmnAnalysisResult(analysisResult, bpmnElements, amountOfRetries)
    }
}
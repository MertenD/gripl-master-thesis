package de.mertendieckmann.griplbackend.application.analyzer

import de.mertendieckmann.griplbackend.ai.BaselineBpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.ai.SharedChatMemoryProvider
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.application.SafetyNet
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging
import java.util.*

class BaselineBpmnAnalyzer(
    llm: ChatModel
): BpmnAnalyzer {

    private val log = KotlinLogging.logger { }
    private val memoryProvider = SharedChatMemoryProvider(50)
    private val bpmnAnalysisAiService = BaselineBpmnAnalysisAiServiceFactory.create(llm, memoryProvider)
    private val safetyNet = SafetyNet(llm, memoryProvider)

    override fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse {
        val sessionId = UUID.randomUUID().toString()

        val bpmnElements = BpmnExtractor().extractBpmnElements(bpmnXml)

        val result = safetyNet.safeGuardAnalysisResultParsing(
            sessionId = sessionId,
            maxRetries = 3
        ) {
            bpmnAnalysisAiService.analyze(sessionId, bpmnXml)
        }.resolveActivities(bpmnElements)
        log.info { "BPMN Analysis Result: $result" }

        return AnalysisResponse.fromBpmnAnalysisResult(result, bpmnXml)
    }
}
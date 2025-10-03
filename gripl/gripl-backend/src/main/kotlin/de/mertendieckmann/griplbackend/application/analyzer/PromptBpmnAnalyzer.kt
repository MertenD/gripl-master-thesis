package de.mertendieckmann.griplbackend.application.analyzer

import de.mertendieckmann.griplbackend.ai.PromptBpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.application.SafetyNet
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging

class PromptBpmnAnalyzer(
    llm: ChatModel
): BpmnAnalyzer {
    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = PromptBpmnAnalysisAiServiceFactory.create(llm)
    private val safetyNet = SafetyNet(llm)

    override fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse {
        val extractor = BpmnExtractor()
        val bpmnElements = extractor.extractBpmnElements(bpmnXml)

        val result = safetyNet.safeGuardAnalysisResultParsing(maxRetries = 2) {
            bpmnAnalysisAiService.analyze(bpmnElements)
        }.resolveActivities(bpmnElements)

        log.info { "BPMN Analysis Result: $result" }

        return AnalysisResponse.fromBpmnAnalysisResult(result, bpmnElements)
    }
}
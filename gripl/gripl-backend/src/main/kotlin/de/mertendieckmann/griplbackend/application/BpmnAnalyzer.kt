package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging

class BpmnAnalyzer(
    llm: ChatModel
) {
    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = BpmnAnalysisAiServiceFactory.create(llm)

    fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse {
        val extractor = BpmnExtractor()
        val bpmnElements = extractor.extractBpmnElements(bpmnXml)

        val result = bpmnAnalysisAiService.analyze(bpmnElements).filterForValidActivities(bpmnElements)
        log.info { "BPMN Analysis Result: $result" }

        return AnalysisResponse.fromBpmnAnalysisResult(result, bpmnElements)
    }
}
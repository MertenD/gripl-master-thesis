package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiService.BpmnAnalysisResult
import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiServiceFactory
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging

class BpmnAnalyzer(
    llm: ChatModel
) {
    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = BpmnAnalysisAiServiceFactory.create(llm)

    fun analyzeBpmnForGdpr(bpmnXml: String): BpmnAnalysisResult {
        val extractor = BpmnExtractor()
        val bpmnElements = extractor.extractBpmnElements(bpmnXml)

        val result = bpmnAnalysisAiService.analyze(bpmnElements)
        log.info { "BPMN Analysis Result: $result" }

        return result.filterForValidActivities(bpmnElements)
    }
}
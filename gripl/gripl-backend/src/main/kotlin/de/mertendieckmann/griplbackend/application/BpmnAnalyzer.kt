package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiService.BpmnAnalysisResult
import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiServiceFactory
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component

class BpmnAnalyzer(
    llm: ChatModel
) {
    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = BpmnAnalysisAiServiceFactory.create(llm)

    fun analyzeBpmnForGdpr(bpmnXml: String): BpmnAnalysisResult {
        val result = bpmnAnalysisAiService.analyze(bpmnXml)
        log.info { "BPMN Analysis Result: $result" }
        return result
    }
}
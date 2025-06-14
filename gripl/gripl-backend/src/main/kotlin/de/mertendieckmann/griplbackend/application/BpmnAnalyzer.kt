package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.dto.ActivityElementId
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging

class BpmnAnalyzer(
    llm: ChatModel
) {
    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = BpmnAnalysisAiServiceFactory.create(llm)

    fun analyzeBpmnForGdpr(bpmnXml: String): List<ActivityElementId> {
        val result = bpmnAnalysisAiService.analyze(bpmnXml)
        log.info { "BPMN Analysis Result: $result" }
        return result.activityElementIds
    }
}
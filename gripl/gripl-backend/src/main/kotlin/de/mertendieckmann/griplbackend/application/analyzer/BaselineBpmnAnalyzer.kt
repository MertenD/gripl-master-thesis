package de.mertendieckmann.griplbackend.application.analyzer

import de.mertendieckmann.griplbackend.ai.BaselineBpmnAnalysisAiServiceFactory
import de.mertendieckmann.griplbackend.application.SafetyNet
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import io.github.oshai.kotlinlogging.KotlinLogging

class BaselineBpmnAnalyzer(
    llm: ChatModel
): BpmnAnalyzer {

    private val log = KotlinLogging.logger { }
    private val bpmnAnalysisAiService = BaselineBpmnAnalysisAiServiceFactory.create(llm)
    private val safetyNet = SafetyNet(llm)

    override fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse {

        val result = safetyNet.safeGuardAnalysisResultParsing(maxRetries = 2) {
            bpmnAnalysisAiService.analyze(bpmnXml)
        }.filterForValidActivities(bpmnXml)
        log.info { "BPMN Analysis Result: $result" }

        return AnalysisResponse.fromBpmnAnalysisResult(result, bpmnXml)
    }
}
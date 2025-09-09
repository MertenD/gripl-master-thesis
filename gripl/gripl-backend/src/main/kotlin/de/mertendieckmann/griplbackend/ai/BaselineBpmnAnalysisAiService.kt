package de.mertendieckmann.griplbackend.ai

import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult
import dev.langchain4j.service.UserMessage

interface BaselineBpmnAnalysisAiService {

    fun analyze(@UserMessage bpmnXml: String): BpmnAnalysisResult
}
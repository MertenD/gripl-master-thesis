package de.mertendieckmann.griplbackend.ai

import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult
import dev.langchain4j.service.UserMessage

interface JsonFixAiService {

    fun fixAnalysisResultJson(@UserMessage error: String): BpmnAnalysisResult
}
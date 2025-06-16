package de.mertendieckmann.griplbackend.model.dto

import de.mertendieckmann.griplbackend.ai.BpmnAnalysisAiService

data class AnalysisRequest(
    val bpmnXml: String
)
data class AnalysisResponse(
    val relevantElements: List<BpmnAnalysisAiService.BpmnAnalysisResult.Element>
)
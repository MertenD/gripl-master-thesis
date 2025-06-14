package de.mertendieckmann.griplbackend.ai

import de.mertendieckmann.griplbackend.dto.ActivityElementId
import dev.langchain4j.service.UserMessage
import jdk.jfr.Description

interface BpmnAnalysisAiService {
    fun analyze(@UserMessage bpmnXml: String): BpmnAnalysisResult

    data class BpmnAnalysisResult(
        @Description("List of Activity Element IDs relevant for GDPR compliance")
        val activityElementIds: List<ActivityElementId>
    )
}
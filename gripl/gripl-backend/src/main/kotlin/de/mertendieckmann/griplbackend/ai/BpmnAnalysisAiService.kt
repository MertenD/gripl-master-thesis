package de.mertendieckmann.griplbackend.ai

import de.mertendieckmann.griplbackend.model.BpmnElement
import dev.langchain4j.service.UserMessage
import jdk.jfr.Description

interface BpmnAnalysisAiService {

    fun analyze(@UserMessage bpmnElements: Set<BpmnElement>): BpmnAnalysisResult

    data class BpmnAnalysisResult(
        @Description("List of Activity Elements that are classified as relevant for GDPR compliance")
        var elements: List<Element>
    ) {
        init {
            elements = elements
                .filter { it.isRelevant }
        }

        @Description("Represents an Activity/Task Element that is classified as relevant for GDPR compliance")
        data class Element(
            @Description("The ID of the Activity Element")
            val id: String,
            @Description("The detailed reason why the Activity Element is relevant for GDPR compliance and why you think personal data is processed.")
            val reason: String,
            @Description("Indicates whether the Activity Element is relevant for GDPR compliance")
            val isRelevant: Boolean = true
        )

        fun filterForValidActivities(bpmnElements: Set<BpmnElement>): BpmnAnalysisResult {
            val existingActivityIds = bpmnElements
                .filter { it.type.typeName.lowercase().contains("task") }
                .map { it.id }.toSet()
            return BpmnAnalysisResult(
                elements = elements.filter { it.id in existingActivityIds }
            )
        }
    }
}
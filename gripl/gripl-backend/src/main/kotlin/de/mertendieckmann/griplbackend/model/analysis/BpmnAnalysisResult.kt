package de.mertendieckmann.griplbackend.model.analysis

import de.mertendieckmann.griplbackend.model.BpmnElement
import jdk.jfr.Description

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

    /**
     * Resolves (possibly) incomplete activity IDs to existing full IDs from the provided BPMN elements.
     * Also removes duplicates after resolution and removes elements that do not exist in the provided BPMN elements.
     */
    fun resolveActivities(actualBpmnElements: Set<BpmnElement>): BpmnAnalysisResult {
        val existingActivityIds = actualBpmnElements
            .filter { it.type.lowercase().contains("task") }
            .map { it.id }.toSet()

        val resolvedDistinct = elements.mapNotNull { element ->
            val resolvedId = resolveActivityIdUniquely(element.id, existingActivityIds)
            resolvedId?.let { if (it == element.id) element else element.copy(id = it) }
        }.distinctBy { it.id }

        return BpmnAnalysisResult(elements = resolvedDistinct)
    }

    /**
     * Attempts to uniquely map a potentially incomplete ID to an existing full ID.
     * First, prefix match (startsWith)
     * If no matches: substring match (contains)
     * Only unique matches will be completed, otherwise null
     */
    private fun resolveActivityIdUniquely(partialId: String, existingActivityIds: Set<String>): String? {
        if (partialId in existingActivityIds) return partialId

        val prefixMatches = existingActivityIds.filter { it.startsWith(partialId) }
        prefixMatches.singleOrNull()?.let { return it }

        val substringMatches = existingActivityIds.filter { it.contains(partialId) }
        return substringMatches.singleOrNull()
    }
}
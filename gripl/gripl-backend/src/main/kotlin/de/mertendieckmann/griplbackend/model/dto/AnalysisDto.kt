package de.mertendieckmann.griplbackend.model.dto

import de.mertendieckmann.griplbackend.model.BpmnElement
import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult

data class AnalysisResponse(
    val criticalElements: List<CriticalElement>
) {
    data class CriticalElement(
        val id: String,
        val name: String?,
        val reason: String
    )

    companion object {
        fun fromBpmnAnalysisResult(result: BpmnAnalysisResult, bpmnElements: Set<BpmnElement>): AnalysisResponse {
            val elements = result.elements.map { element ->
                CriticalElement(
                    id = element.id,
                    name = bpmnElements.find { it.id == element.id }?.name,
                    reason = element.reason
                )
            }

            return AnalysisResponse(
                criticalElements = elements
            )
        }
    }
}
package de.mertendieckmann.griplbackend.model.dto

import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.model.BpmnElement
import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult

data class AnalysisResponse(
    val criticalElements: List<CriticalElement>,
    val amountOfRetries: Int? = null
) {
    data class CriticalElement(
        val id: String,
        val name: String?,
        val reason: String
    )

    companion object {
        fun fromBpmnAnalysisResult(result: BpmnAnalysisResult, bpmnElements: Set<BpmnElement>, amountOfRetries: Int): AnalysisResponse {
            val elements = result.elements.map { element ->
                CriticalElement(
                    id = element.id,
                    name = bpmnElements.find { it.id == element.id }?.name,
                    reason = element.reason
                )
            }

            return AnalysisResponse(
                criticalElements = elements,
                amountOfRetries = amountOfRetries
            )
        }

        fun fromBpmnAnalysisResult(result: BpmnAnalysisResult, bpmnXml: String, amountOfRetries: Int): AnalysisResponse {
            val extractor = BpmnExtractor()
            val bpmnElements = extractor.extractBpmnElements(bpmnXml)
            return fromBpmnAnalysisResult(result, bpmnElements, amountOfRetries)
        }
    }
}
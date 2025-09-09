package de.mertendieckmann.griplbackend.application.analyzer

import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse

interface BpmnAnalyzer {

    fun analyzeBpmnForGdpr(bpmnXml: String): AnalysisResponse
}
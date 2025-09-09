package de.mertendieckmann.griplbackend.ai

import de.mertendieckmann.griplbackend.model.BpmnElement
import de.mertendieckmann.griplbackend.model.analysis.BpmnAnalysisResult
import dev.langchain4j.service.UserMessage

interface PromptBpmnAnalysisAiService {

    fun analyze(@UserMessage bpmnElements: Set<BpmnElement>): BpmnAnalysisResult
}
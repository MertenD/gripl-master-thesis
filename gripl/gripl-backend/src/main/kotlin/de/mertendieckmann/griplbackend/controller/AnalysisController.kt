package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.chat.BpmnAnalyzer
import de.mertendieckmann.griplbackend.dto.AnalysisRequest
import de.mertendieckmann.griplbackend.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/gdpr")
class AnalysisController(
    private val llm: ChatModel
) {

    @PostMapping("/analysis")
    fun analyzeBpmnForGdpr(@RequestBody request: AnalysisRequest): ResponseEntity<AnalysisResponse> {

        val analyzer = BpmnAnalyzer(llm = llm)
        val relevantActivityElementIds = analyzer.analyzeBpmnForGdpr(request.bpmnXml)

        val response = AnalysisResponse(activityElementIds = relevantActivityElementIds)
        return ResponseEntity(response, HttpStatus.OK)
    }
}
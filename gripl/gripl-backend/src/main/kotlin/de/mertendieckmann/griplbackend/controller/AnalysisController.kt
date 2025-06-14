package de.mertendieckmann.griplbackend.controller

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

        // Extract all Activity Element Ids from the BPMN XML
        val bpmnXml = request.bpmnXml
        val activityElementIds = bpmnXml
            .split("<bpmn:task id=\"")
            .drop(1)
            .map { it.substringBefore("\"") }

        // Wait for 4 seconds
        Thread.sleep(2000)

        val response = AnalysisResponse(activityElementIds = activityElementIds)
        return ResponseEntity(response, HttpStatus.OK)
    }
}
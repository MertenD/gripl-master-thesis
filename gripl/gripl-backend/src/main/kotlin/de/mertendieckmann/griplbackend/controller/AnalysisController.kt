package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisRequest
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import dev.langchain4j.model.chat.ChatModel
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/gdpr")
class AnalysisController(
    private val llm: ChatModel,
    private val evaluationRunner: EvaluationRunner
) {

    @PostMapping("/analysis")
    fun analyzeBpmnForGdpr(@RequestBody request: AnalysisRequest): ResponseEntity<AnalysisResponse> {

        // TODO Validate request

        val extractor = BpmnExtractor()
        extractor.extractBpmnElements(request.bpmnXml)

        // TODO Remove
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(AnalysisResponse(emptyList()))

        val analyzer = BpmnAnalyzer(llm = llm)
        val analysisResult = analyzer.analyzeBpmnForGdpr(request.bpmnXml)

        val response = AnalysisResponse(relevantElements = analysisResult.elements)
        return ResponseEntity(response, HttpStatus.OK)
    }

    @GetMapping("/evaluation", produces = [MediaType.TEXT_MARKDOWN_VALUE])
    fun evaluate(): String {
        return evaluationRunner.run()
    }
}
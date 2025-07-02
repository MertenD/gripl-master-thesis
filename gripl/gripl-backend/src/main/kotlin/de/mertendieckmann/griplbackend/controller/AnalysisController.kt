package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisRequest
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import de.mertendieckmann.griplbackend.model.dto.EvaluationReport
import dev.langchain4j.model.chat.ChatModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/gdpr")
@CrossOrigin(
    origins = ["\${app.frontend.base-url}"],
    allowCredentials = "true",
    methods = [RequestMethod.GET]
)
class AnalysisController(
    private val llm: ChatModel,
    private val evaluationRunner: EvaluationRunner
) {

    @PostMapping("/analysis")
    fun analyzeBpmnForGdpr(@RequestBody request: AnalysisRequest): ResponseEntity<AnalysisResponse> {

        // TODO Validate request

        val analyzer = BpmnAnalyzer(llm = llm)
        val analysisResult = analyzer.analyzeBpmnForGdpr(request.bpmnXml)

        val response = AnalysisResponse(relevantElements = analysisResult.elements)
        return ResponseEntity(response, HttpStatus.OK)
    }

    @GetMapping("/evaluation/markdown", produces = [MediaType.TEXT_MARKDOWN_VALUE])
    suspend fun evaluate(): String {
        val reports = mutableListOf<EvaluationReport>()
        evaluationRunner.run { reports.add(it) }
        return reports.joinToString("\n\n") { it.toMarkdown() }
    }

    @GetMapping("/evaluation/stream", produces = [MediaType.APPLICATION_NDJSON_VALUE])
    suspend fun evaluateStream(): Flow<EvaluationReport> = flow {
        evaluationRunner.run {
            emit(it)
        }
    }
}
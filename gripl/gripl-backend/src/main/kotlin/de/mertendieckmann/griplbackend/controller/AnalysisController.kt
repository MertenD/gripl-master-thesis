package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisRequest
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import de.mertendieckmann.griplbackend.model.dto.EvaluationReport
import dev.langchain4j.model.chat.ChatModel
import io.swagger.v3.oas.annotations.Operation
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
    allowedHeaders = ["*"],
    methods = [
        RequestMethod.GET,
        RequestMethod.POST,
    ]
)
class AnalysisController(
    private val llm: ChatModel,
    private val evaluationRunner: EvaluationRunner
) {

    @Operation(
        summary = "Analyzes BPMN-XML for GDPR relevance",
        description = "Analyzes the provided BPMN-XML String and identifies GDPR-relevant elements using AI analysis. It returns a list of relevant elements found in the BPMN model including the reasoning for each element."
    )
    @PostMapping("/analysis")
    fun analyzeBpmnForGdpr(@RequestBody request: AnalysisRequest): ResponseEntity<AnalysisResponse> {

        // TODO Validate request

        val analyzer = BpmnAnalyzer(llm = llm)
        val analysisResult = analyzer.analyzeBpmnForGdpr(request.bpmnXml)

        val response = AnalysisResponse(relevantElements = analysisResult.elements)
        return ResponseEntity(response, HttpStatus.OK)
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a markdown report with the results."
    )
    @GetMapping("/evaluation/markdown", produces = [MediaType.TEXT_MARKDOWN_VALUE])
    suspend fun evaluate(): String {
        val reports = mutableListOf<EvaluationReport>()
        evaluationRunner.run { reports.add(it) }
        return reports.joinToString("\n\n") { it.markdown }
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a JSON report with the results in a stream."
    )
    @GetMapping("/evaluation/stream", produces = [MediaType.APPLICATION_NDJSON_VALUE])
    suspend fun evaluateStream(): Flow<EvaluationReport> = flow {
        evaluationRunner.run {
            emit(it)
        }
    }
}
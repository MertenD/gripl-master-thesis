package de.mertendieckmann.griplbackend.adapter.web

import de.mertendieckmann.griplbackend.application.factory.AnalyzerFactory
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.config.LlmConfig.Companion.LlmProps
import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.*
import io.swagger.v3.oas.annotations.Operation
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

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
    private val analyzerFactory: AnalyzerFactory,
    private val evaluationRunner: EvaluationRunner,
    @Qualifier("analysisEndpoints") private val analysisEndpoints: List<AnalysisEndpoint>
) {

    @Operation(
        summary = "Get all available analysis endpoints",
        description = "Returns a list of all available analysis endpoints that can be used for GDPR analysis."
    )
    @GetMapping("/analysis/endpoints", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAnalysisEndpoints(): ResponseEntity<List<AnalysisEndpoint>> {
        return ResponseEntity(analysisEndpoints, HttpStatus.OK)
    }

    @Operation(
        summary = "Analyzes BPMN-XML for GDPR relevance",
        description = "Upload a BPMN XML document (file part **bpmnFile**). The service analyzes it with an LLM, and returns a list"
            + " of GDPR-relevant elements found in the BPMN model, including the reasoning for each element."
    )
    @PostMapping(
        "/analysis/v1",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun analyzeBpmnForGdpr(
        @RequestPart("bpmnFile") file: FilePart,
        @RequestPart("llmProps", required = false) llmProps: LlmProps? = null
    ): Mono<ResponseEntity<AnalysisResponse>> {

        val bpmnXmlMono: Mono<String> = DataBufferUtils
            .join(file.content())
            .map { dataBuffer ->
                dataBuffer.asInputStream().bufferedReader().use { it.readText() }
            }

        return bpmnXmlMono.flatMap { bpmnXml ->
            val analyzer = analyzerFactory.create(llmProps ?: LlmConfig.Companion.LlmProps())

            val analysisResult = analyzer.analyzeBpmnForGdpr(bpmnXml)

            val response = AnalysisResponse(relevantElements = analysisResult.elements)
            Mono.just(ResponseEntity(response, HttpStatus.OK))
        }
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a markdown report with the results."
    )
    @PostMapping("/evaluation/markdown", produces = [MediaType.TEXT_MARKDOWN_VALUE])
    suspend fun evaluate(
        @RequestBody evaluationRequest: EvaluationRequest
    ): String {
        val reports = mutableListOf<EvaluationReport>()
        evaluationRunner.run(evaluationRequest) {
            if (it !is EvaluationReportStepInfo) reports.add(it)
        }
        return reports.joinToString("\n\n") { it.markdown }
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a JSON report with the results in a stream."
    )
    @PostMapping("/evaluation/stream", produces = [MediaType.APPLICATION_NDJSON_VALUE])
    suspend fun evaluateStream(
        @RequestBody evaluationRequest: EvaluationRequest
    ): Flow<EvaluationReport> = flow {
        println("Starting evaluation with request: $evaluationRequest")
        evaluationRunner.run(evaluationRequest) {
            emit(it)
        }
    }
}
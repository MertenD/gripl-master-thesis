package de.mertendieckmann.griplbackend.adapter.web

import de.mertendieckmann.griplbackend.adapter.web.utils.ControllerUtils
import de.mertendieckmann.griplbackend.application.factory.AnalyzerFactory
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.evaluation.MultiEvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.*
import io.swagger.v3.oas.annotations.Operation
import kotlinx.coroutines.flow.Flow
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.core.env.Environment
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

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
    private val multiEvaluationRunner: MultiEvaluationRunner,
    private val llmConfig: LlmConfig,
    @Qualifier("analysisEndpoints") private val analysisEndpoints: List<AnalysisEndpoint>,
    private val env: Environment
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
        "/analysis/prompt-engineering",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun analyzeBpmnForGdprPromptEngineering(
        @RequestPart("bpmnFile") file: FilePart,
        @RequestPart("llmProps", required = false) llmPropsOverrides: LlmConfig.Companion.LlmPropsOverride? = null
    ): Mono<ResponseEntity<AnalysisResponse>> {

        val bpmnXmlMono: Mono<String> = ControllerUtils.getBpmnXmlMono(file)
        val resolvedLlmPropsOverride = ControllerUtils.resolveEnvironmentVariables(llmPropsOverrides, env)

        return bpmnXmlMono.flatMap { bpmnXml ->
            Mono.fromCallable {
                val llm = llmConfig.buildWithOverride(resolvedLlmPropsOverride)
                val analyzer = analyzerFactory.createPromptEngineeringAnalyzer(llm)
                analyzer.analyzeBpmnForGdpr(bpmnXml)
            }.subscribeOn(Schedulers.boundedElastic())
        }.map { ResponseEntity.ok(it) }
    }

    @PostMapping(
        "/analysis/baseline",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun analyzeBpmnForGdprBaseline(
        @RequestPart("bpmnFile") file: FilePart,
        @RequestPart("llmProps", required = false) llmPropsOverrides: LlmConfig.Companion.LlmPropsOverride? = null
    ): Mono<ResponseEntity<AnalysisResponse>> {

        val bpmnXmlMono: Mono<String> = ControllerUtils.getBpmnXmlMono(file)
        val resolvedLlmPropsOverride = ControllerUtils.resolveEnvironmentVariables(llmPropsOverrides, env)

        return bpmnXmlMono.flatMap { bpmnXml ->
            Mono.fromCallable {
                val llm = llmConfig.buildWithOverride(resolvedLlmPropsOverride)
                val analyzer = analyzerFactory.createBaselineAnalyzer(llm)
                analyzer.analyzeBpmnForGdpr(bpmnXml)
            }.subscribeOn(Schedulers.boundedElastic())
        }.map { ResponseEntity.ok(it) }
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a markdown report with the results."
    )
    @PostMapping("/evaluation/markdown", produces = [MediaType.TEXT_MARKDOWN_VALUE])
    suspend fun evaluate(
        @RequestBody request: MultiEvaluationRequest
    ): String {
        val sb = StringBuilder()
        var currentLabel: String? = null
        val resolvedRequest = ControllerUtils.resolveEnvironmentVariables(request, env)
            ?: throw IllegalArgumentException("Invalid request after resolving environment variables.")

        multiEvaluationRunner.runAll(resolvedRequest).collect { envelope ->
            val (label, report) = envelope

            if (currentLabel != label) {
                if (currentLabel != null) sb.appendLine()
                sb.appendLine("# Modell: $label").appendLine()
                currentLabel = label
            }

            if (report !is EvaluationReportStepInfo) {
                val md = report.toMarkdown()
                if (md.isNotBlank()) {
                    sb.appendLine(md).appendLine()
                }
            }
        }

        return sb.toString().trimEnd()
    }

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a JSON report with the results in a stream."
    )
    @PostMapping("/evaluation/stream", produces = [MediaType.APPLICATION_NDJSON_VALUE])
    suspend fun evaluateStream(
        @RequestBody request: MultiEvaluationRequest
    ): Flow<ModelReportEnvelope> {
        val resolvedRequest = ControllerUtils.resolveEnvironmentVariables(request, env)
            ?: throw IllegalArgumentException("Invalid request after resolving environment variables.")
        return multiEvaluationRunner.runAll(resolvedRequest)
    }
}
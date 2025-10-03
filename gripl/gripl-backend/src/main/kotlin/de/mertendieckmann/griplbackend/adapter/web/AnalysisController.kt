package de.mertendieckmann.griplbackend.adapter.web

import de.mertendieckmann.griplbackend.adapter.web.utils.ControllerUtils
import de.mertendieckmann.griplbackend.application.analyzer.AnalyzerFactory
import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.model.dto.AnalysisEndpoint
import de.mertendieckmann.griplbackend.model.dto.AnalysisResponse
import io.swagger.v3.oas.annotations.Operation
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
@RequestMapping("/gdpr/analysis")
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
    private val llmConfig: LlmConfig,
    @Qualifier("analysisEndpoints") private val analysisEndpoints: List<AnalysisEndpoint>,
    private val env: Environment
) {

    @Operation(
        summary = "Get all available analysis endpoints",
        description = "Returns a list of all available analysis endpoints that can be used for GDPR analysis."
    )
    @GetMapping("/endpoints", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAnalysisEndpoints(): ResponseEntity<List<AnalysisEndpoint>> {
        return ResponseEntity(analysisEndpoints, HttpStatus.OK)
    }

    @Operation(
        summary = "Analyzes BPMN-XML for GDPR relevance with prompt engineering",
        description = "Upload a BPMN XML document (file part **bpmnFile**). The service analyzes it with an LLM, and returns a list"
            + " of GDPR-relevant elements found in the BPMN model, including the reasoning for each element."
    )
    @PostMapping(
        "/prompt-engineering",
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
                val llm = llmConfig.buildStrictJsonModelWithOverride(resolvedLlmPropsOverride)
                val analyzer = analyzerFactory.createPromptEngineeringAnalyzer(llm)
                analyzer.analyzeBpmnForGdpr(bpmnXml)
            }.subscribeOn(Schedulers.boundedElastic())
        }.map { ResponseEntity.ok(it) }
    }

    @Operation(
        summary = "Analyzes BPMN-XML for GDPR relevance using baseline method",
        description = "Upload a BPMN XML document (file part **bpmnFile**). The service analyzes it with a baseline method, and returns a list"
            + " of GDPR-relevant elements found in the BPMN model, including the reasoning for each element."
    )
    @PostMapping(
        "/baseline",
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
                val llm = llmConfig.buildStrictJsonModelWithOverride(resolvedLlmPropsOverride)
                val analyzer = analyzerFactory.createBaselineAnalyzer(llm)
                analyzer.analyzeBpmnForGdpr(bpmnXml)
            }.subscribeOn(Schedulers.boundedElastic())
        }.map { ResponseEntity.ok(it) }
    }
}
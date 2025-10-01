package de.mertendieckmann.griplbackend.adapter.web

import de.mertendieckmann.griplbackend.adapter.web.utils.ControllerUtils
import de.mertendieckmann.griplbackend.evaluation.MultiEvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.EvaluationReportStepInfo
import de.mertendieckmann.griplbackend.model.dto.ModelReportEnvelope
import de.mertendieckmann.griplbackend.model.dto.MultiEvaluationRequest
import io.swagger.v3.oas.annotations.Operation
import kotlinx.coroutines.flow.Flow
import org.springframework.core.env.Environment
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/gdpr/evaluation")
@CrossOrigin(
    origins = ["\${app.frontend.base-url}"],
    allowCredentials = "true",
    allowedHeaders = ["*"],
    methods = [
        RequestMethod.GET,
        RequestMethod.POST,
    ]
)
class EvaluationController(
    private val multiEvaluationRunner: MultiEvaluationRunner,
    private val env: Environment
) {

    @Operation(
        summary = "Evaluates the classification algorithm against the dataset",
        description = "Runs the evaluation of the classification algorithm against all process models inside the dataset and returns a markdown report with the results."
    )
    @PostMapping("/markdown", produces = [MediaType.TEXT_MARKDOWN_VALUE])
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
    @PostMapping("/stream", produces = [MediaType.APPLICATION_NDJSON_VALUE])
    suspend fun evaluateStream(
        @RequestBody request: MultiEvaluationRequest
    ): Flow<ModelReportEnvelope> {
        val resolvedRequest = ControllerUtils.resolveEnvironmentVariables(request, env)
            ?: throw IllegalArgumentException("Invalid request after resolving environment variables.")
        return multiEvaluationRunner.runAll(resolvedRequest)
    }
}
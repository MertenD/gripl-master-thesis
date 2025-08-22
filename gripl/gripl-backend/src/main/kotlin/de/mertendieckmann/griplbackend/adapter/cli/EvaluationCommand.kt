package de.mertendieckmann.griplbackend.adapter.cli

import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.evaluation.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisEndpoint
import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import picocli.CommandLine.Option
import picocli.CommandLine.Command
import picocli.CommandLine.Parameters

@Command(
    name = "evaluation",
    description = ["Run the evaluation with the dataset from the database"],
    mixinStandardHelpOptions = true
)
@Component
class EvaluationCommand(
    private val evaluationRunner: EvaluationRunner,
    @Qualifier("analysisEndpoints") private val analysisEndpoints: List<AnalysisEndpoint>
): Runnable {

    @Parameters(paramLabel = "EVALUATION_ENDPOINT", defaultValue = "", description = ["Endpoint for the evaluation service"])
    lateinit var evaluationEndpoint: String
    @Option(names = ["-o", "--outputFormat"], defaultValue = "pretty", description = [
        "Output format for the evaluation results. Supported formats: 'pretty' (default), 'json'."
    ]) lateinit var outputFormat: String
    @Option(names = ["--baseUrl"], description = ["Base URL for the LLM API"], required = false) var baseUrl: String? = null
    @Option(names = ["--modelName"], description = ["Model name for the LLM"], required = false) var modelName: String? = null
    @Option(names = ["--apiKey"], description = ["API key for the LLM"], required = false) var apiKey: String? = null
    @Option(names = ["--timeoutSeconds"], description = ["Timeout in seconds for the LLM requests"], required = false) var timeoutSeconds: Long? = null

    override fun run() = runBlocking {
        val llmProps = LlmConfig.Companion.LlmPropsOverride(
            baseUrl = baseUrl,
            modelName = modelName,
            apiKey = apiKey,
            timeoutSeconds = timeoutSeconds,
        )
        evaluationEndpoint = evaluationEndpoint.ifBlank {
            EvaluationRequest().evaluationEndpoint
        }

        evaluationRunner.run(EvaluationRequest(evaluationEndpoint, llmProps)) { println(CliOutput.print(it, outputFormat)) }
    }
}
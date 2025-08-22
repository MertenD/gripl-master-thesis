package de.mertendieckmann.griplbackend.adapter.cli

import de.mertendieckmann.griplbackend.config.LlmConfig
import de.mertendieckmann.griplbackend.evaluation.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisEndpoint
import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.count
import kotlinx.coroutines.flow.onEach
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

    enum class OutputFormat { pretty, json }

    @Parameters(
        paramLabel = "EVALUATION_ENDPOINT",
        arity = "0..1",
        description = ["Endpoint for the evaluation service"]
    )
    var evaluationEndpoint: String? = null

    @Option(
        names = ["-o", "--outputFormat"],
        defaultValue = "pretty",
        description = ["Output format: \${COMPLETION-CANDIDATES}"]
    )
    var outputFormat: OutputFormat = OutputFormat.pretty

    @Option(names = ["--baseUrl"], description = ["Base URL for the LLM API"])
    var baseUrl: String? = null

    @Option(names = ["--modelName"], description = ["Model name for the LLM"])
    var modelName: String? = null

    @Option(names = ["--apiKey"], description = ["API key for the LLM"])
    var apiKey: String? = null

    @Option(names = ["--timeoutSeconds"], description = ["Timeout in seconds for the LLM requests"])
    var timeoutSeconds: Long? = null

    override fun run() = runBlocking {
        val defaultRequest = EvaluationRequest()
        val endpoint = evaluationEndpoint?.takeUnless { it.isBlank() } ?: defaultRequest.evaluationEndpoint

        val llmProps = LlmConfig.Companion.LlmPropsOverride(
            baseUrl = baseUrl,
            modelName = modelName,
            apiKey = apiKey,
            timeoutSeconds = timeoutSeconds,
        )

        evaluationRunner.run(EvaluationRequest(endpoint, llmProps)).onEach {
            println(CliOutput.print(it, outputFormat.name))
        }.collect()
    }
}
package de.mertendieckmann.griplbackend.adapter.cli

import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.AnalysisEndpoint
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import picocli.CommandLine
import picocli.CommandLine.Command

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

    @CommandLine.Parameters(paramLabel = "EVALUATION_ENDPOINT", defaultValue = "", description = ["Endpoint for the evaluation service"])
    lateinit var evaluationEndpoint: String
    @CommandLine.Option(names = ["-o", "--outputFormat"], defaultValue = "pretty", description = [
        "Output format for the evaluation results. Supported formats: 'pretty' (default), 'json'."
    ]) lateinit var outputFormat: String

    override fun run() = runBlocking {
        evaluationEndpoint = evaluationEndpoint.ifBlank {
            analysisEndpoints.firstOrNull()?.endpoint
                ?: throw IllegalArgumentException("No evaluation endpoint provided and no default endpoint available.")
        }
        evaluationRunner.run(evaluationEndpoint) { println(CliOutput.print(it, outputFormat)) }
    }
}
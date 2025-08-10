package de.mertendieckmann.griplbackend.adapter.cli

import de.mertendieckmann.griplbackend.evaluation.runner.EvaluationRunner
import kotlinx.coroutines.runBlocking
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
    private val evaluationRunner: EvaluationRunner
): Runnable {

    @CommandLine.Option(names = ["-o", "--outputFormat"], defaultValue = "pretty", description = [
        "Output format for the evaluation results. Supported formats: 'pretty' (default), 'json'."
    ]) lateinit var outputFormat: String

    override fun run() = runBlocking {
        evaluationRunner.run { println(CliOutput.print(it, outputFormat)) }
    }
}
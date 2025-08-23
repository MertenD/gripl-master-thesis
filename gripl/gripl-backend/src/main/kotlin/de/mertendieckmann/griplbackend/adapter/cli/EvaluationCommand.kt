package de.mertendieckmann.griplbackend.adapter.cli


import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import de.mertendieckmann.griplbackend.evaluation.MultiEvaluationRunner
import de.mertendieckmann.griplbackend.model.dto.EvaluationReportStepInfo
import de.mertendieckmann.griplbackend.model.dto.MultiEvaluationRequest
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.runBlocking
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import picocli.CommandLine.Command
import picocli.CommandLine.Option
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardOpenOption

@Command(
    name = "evaluation",
    description = ["Run the evaluation with the dataset from the database"],
    mixinStandardHelpOptions = true
)
@Component
class EvaluationCommand(
    private val multiEvaluationRunner: MultiEvaluationRunner,
    private val env: Environment
): Runnable {

    private val log = KotlinLogging.logger {}

    @Option(
        names = ["-c", "--config"],
        required = true,
        description = ["Path to a YAML file describing a MultiEvaluationRequest"]
    )
    lateinit var configPath: String

    @Option(
        names = ["-o", "--out"],
        required = false,
        description = ["Path to the output Markdown file (default: ./evaluation_report_multi.md)"]
    )
    var outPath: String = "evaluation_report_multi.md"

    override fun run() = runBlocking {
        val request = loadYaml(configPath)

        val outputPath = Path.of(outPath)
        outputPath.parent?.let { Files.createDirectories(it) }

        Files.newBufferedWriter(
            outputPath,
            StandardCharsets.UTF_8,
            StandardOpenOption.CREATE,
            StandardOpenOption.TRUNCATE_EXISTING,
            StandardOpenOption.WRITE
        ).use { writer ->

            var currentLabel: String? = null

            multiEvaluationRunner
                .runAll(request)
                .onEach { envelope ->
                    val label = envelope.modelLabel
                    val report = envelope.report

                    if (currentLabel != label) {
                        if (currentLabel != null) writer.appendLine()
                        writer.appendLine("# Model: $label")
                        writer.appendLine()
                        currentLabel = label
                    }

                    if (report is EvaluationReportStepInfo) return@onEach

                    val md = report.toMarkdown()
                    if (md.isNotBlank()) {
                        writer.appendLine(md)
                        writer.appendLine()
                    }
                }
                .collect()
        }

        log.info { "Evaluation report written to: $outPath" }
    }

    private fun loadYaml(pathStr: String): MultiEvaluationRequest {
        val path = Path.of(pathStr)
        require(Files.exists(path)) { "Config file not found: $pathStr" }
        val raw = Files.readString(path, StandardCharsets.UTF_8)
        val resolved = substituteEnv(raw)

        val mapper = ObjectMapper(YAMLFactory())
            .registerKotlinModule()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)

        return mapper.readValue<MultiEvaluationRequest>(resolved)
    }

    private fun substituteEnv(text: String): String {
        return env.resolveRequiredPlaceholders(text)
    }
}
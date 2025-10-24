package de.mertendieckmann.griplbackend.adapter.cli

import de.mertendieckmann.griplbackend.application.analyzer.AnalyzerFactory
import de.mertendieckmann.griplbackend.config.LlmConfig
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component
import picocli.CommandLine.Command
import picocli.CommandLine.Option
import picocli.CommandLine.Parameters
import java.nio.file.Files
import java.nio.file.Path
import de.mertendieckmann.griplbackend.config.LlmConfig.Companion.LlmPropsOverride

@Command(
    name = "analysis",
    description = ["Analyze a BPMN file for GDPR compliance"],
    mixinStandardHelpOptions = true
)
@Component
class AnalysisCommand(
    private val analyzerFactory: AnalyzerFactory,
    private val LlmConfig: LlmConfig
): Runnable {

    private val log = KotlinLogging.logger { }

    @Parameters(paramLabel = "BPMN_FILE", description = ["Path to the BPMN file to analyze"]) lateinit var bpmnFilePath: Path
    @Option(names = ["-o", "--outputFormat"], defaultValue = "pretty", description = [
        "Output format for the analysis result. Supported formats: 'pretty' (default), 'json'."
    ]) lateinit var outputFormat: String
    @Option(names = ["--baseUrl"], description = ["Base URL for the LLM API"], required = false) var baseUrl: String? = null
    @Option(names = ["--modelName"], description = ["Model name for the LLM"], required = false) var modelName: String? = null
    @Option(names = ["--apiKey"], description = ["API key for the LLM"], required = false) var apiKey: String? = null
    @Option(names = ["--timeoutSeconds"], description = ["Timeout in seconds for the LLM requests"], required = false) var timeoutSeconds: Long? = null
    @Option(names = ["--temperature"], description = ["Temperature setting for the LLM"], required = false) var temperature: Double? = null
    @Option(names = ["--topP"], description = ["Top-p setting for the LLM"], required = false) var topP: Double? = null

    override fun run() {
        log.info { "Running analysis on BPMN file: $bpmnFilePath with output format: $outputFormat" }
        val bpmnXml = Files.readString(bpmnFilePath)

        val llm = LlmConfig.buildStrictJsonModelWithOverride(LlmPropsOverride(
            baseUrl = baseUrl,
            modelName = modelName,
            apiKey = apiKey,
            timeoutSeconds = timeoutSeconds,
            temperature = temperature,
            topP = topP
        ))

        val analyzer = analyzerFactory.createPromptEngineeringAnalyzer(llm)
        val result = analyzer.analyzeBpmnForGdpr(bpmnXml)
        CliOutput.print(result, outputFormat)
    }
}
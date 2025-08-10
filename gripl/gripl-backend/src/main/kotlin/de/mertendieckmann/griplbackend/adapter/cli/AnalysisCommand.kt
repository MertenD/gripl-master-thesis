package de.mertendieckmann.griplbackend.adapter.cli

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import de.mertendieckmann.griplbackend.application.factory.AnalyzerFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component
import picocli.CommandLine.Command
import picocli.CommandLine.Option
import picocli.CommandLine.Parameters
import java.nio.file.Files
import java.nio.file.Path

@Command(
    name = "analysis",
    description = ["Analyze a BPMN file for GDPR compliance"],
    mixinStandardHelpOptions = true
)
@Component
class AnalysisCommand(
    private val analyzerFactory: AnalyzerFactory,
): Runnable {

    private val log = KotlinLogging.logger { }

    @Parameters(paramLabel = "BPMN_FILE", description = ["Path to the BPMN file to analyze"]) lateinit var bpmnFilePath: Path
    @Option(names = ["-o", "--outputFormat"], defaultValue = "pretty", description = [
        "Output format for the analysis result. Supported formats: 'pretty' (default), 'json'."
    ]) lateinit var outputFormat: String

    override fun run() {
        log.info { "Running analysis on BPMN file: $bpmnFilePath with output format: $outputFormat" }
        val bpmnXml = Files.readString(bpmnFilePath)
        val analyzer = analyzerFactory.create()
        val result = analyzer.analyzeBpmnForGdpr(bpmnXml)
        CliOutput.print(result, outputFormat)
    }
}
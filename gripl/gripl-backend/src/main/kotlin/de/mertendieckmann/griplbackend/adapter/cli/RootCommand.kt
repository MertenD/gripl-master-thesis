package de.mertendieckmann.griplbackend.adapter.cli

import org.springframework.stereotype.Component
import picocli.CommandLine
import picocli.CommandLine.Command

@Command(
    name = "gripl",
    description = ["GRIPL CLI for analyzing bpmn files and running the evaluation"],
    mixinStandardHelpOptions = true,
    subcommands = [
        AnalysisCommand::class,
        EvaluationCommand::class
    ]
)
@Component
class RootCommand: Runnable {
    override fun run() = CommandLine.usage(this, System.out)
}
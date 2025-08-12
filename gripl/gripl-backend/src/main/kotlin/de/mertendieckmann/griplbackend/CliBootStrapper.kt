package de.mertendieckmann.griplbackend

import de.mertendieckmann.griplbackend.adapter.cli.RootCommand
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.stereotype.Component
import picocli.CommandLine
import picocli.spring.PicocliSpringFactory
import kotlin.system.exitProcess

@Component
class CliBootStrapper(
    private val root: RootCommand,
    private val ctx: ConfigurableApplicationContext
): ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        if (args.nonOptionArgs.isEmpty()) return

        val picocliArgs = args.sourceArgs.filterNot {
            it.startsWith("--llm.")
        }

        val exit = CommandLine(root, PicocliSpringFactory(ctx))
            .setCaseInsensitiveEnumValuesAllowed(true)
            .execute(*picocliArgs.toTypedArray())

        ctx.close()
        exitProcess(exit)
    }
}
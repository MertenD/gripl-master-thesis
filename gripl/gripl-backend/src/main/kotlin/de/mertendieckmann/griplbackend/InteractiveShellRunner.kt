package de.mertendieckmann.griplbackend

import de.mertendieckmann.griplbackend.adapter.cli.RootCommand
import org.jline.reader.EndOfFileException
import org.jline.reader.LineReaderBuilder
import org.jline.reader.UserInterruptException
import org.jline.reader.impl.LineReaderImpl
import org.jline.reader.impl.history.DefaultHistory
import org.jline.terminal.TerminalBuilder
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.stereotype.Component
import picocli.CommandLine
import picocli.shell.jline3.PicocliJLineCompleter
import picocli.spring.PicocliSpringFactory
import java.util.concurrent.Executors
import kotlin.system.exitProcess

@Component
class InteractiveShellRunner(
    private val ctx: ConfigurableApplicationContext,
    private val root: RootCommand
) : ApplicationRunner {

    @Value("\${app.shell.enabled:false}")
    private var enabled: Boolean = false

    override fun run(args: ApplicationArguments) {
        if (!enabled || args.nonOptionArgs.isNotEmpty()) return

        Executors.newSingleThreadExecutor { r -> Thread(r, "gripl-shell").apply { isDaemon = true } }
            .submit { runShell() }
    }

    private fun runShell() {
        val factory = PicocliSpringFactory(ctx)
        val cmd = CommandLine(root, factory).setCaseInsensitiveEnumValuesAllowed(true)

        val terminal = TerminalBuilder.builder().system(true).build()
        val reader = LineReaderBuilder.builder()
            .terminal(terminal)
            .completer(PicocliJLineCompleter(cmd.commandSpec))
            .history(DefaultHistory())
            .build()

        while (ctx.isActive) {
            try {
                val line = reader.readLine("gripl> ")
                if (line.isBlank()) continue
                if (line in listOf("exit", "quit")) break

                val parsed = (reader as LineReaderImpl).parser.parse(line, line.length)
                val argv = parsed.words().toTypedArray()

                cmd.execute(*argv)
            } catch (_: UserInterruptException) {
            } catch (_: EndOfFileException) {
                break
            } catch (e: Exception) {
                println("Error: ${e.message}")
            }
        }

        ctx.close()
        exitProcess(0)
    }
}
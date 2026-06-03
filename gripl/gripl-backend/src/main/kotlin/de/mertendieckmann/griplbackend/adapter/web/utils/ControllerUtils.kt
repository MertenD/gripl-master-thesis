package de.mertendieckmann.griplbackend.adapter.web.utils

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.core.env.Environment
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.http.codec.multipart.FilePart
import reactor.core.publisher.Mono

object ControllerUtils {

    // Only these env vars may be resolved via ${VAR} placeholders in request bodies.
    // Prevents exfiltration of arbitrary secrets (e.g. DB credentials) by attackers who
    // control the LLM endpoint and can receive the resolved value as an Authorization header.
    private val RESOLVABLE_ENV_VARS = setOf("OPENAI_API_KEY", "OPEN_ROUTER_API_KEY")
    private val PLACEHOLDER_REGEX = Regex("""\$\{([^}]+)}""")

    fun getBpmnXmlMono(file: FilePart): Mono<String> {
        return DataBufferUtils
            .join(file.content())
            .map { dataBuffer ->
                dataBuffer.asInputStream().bufferedReader().use { it.readText() }
            }
    }

    inline fun <reified T> resolveEnvironmentVariables(objectToResolve: T?, env: Environment): T? {
        return objectToResolve?.let {
            val json = jacksonObjectMapper().writeValueAsString(it)
            val resolved = PLACEHOLDER_REGEX.replace(json) { match ->
                val varName = match.groupValues[1]
                if (varName in RESOLVABLE_ENV_VARS) env.getProperty(varName) ?: match.value
                else match.value
            }
            jacksonObjectMapper().readValue<T>(resolved)
        }
    }
}
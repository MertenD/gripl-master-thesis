package de.mertendieckmann.griplbackend.adapter.web.utils

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.core.env.Environment
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.http.codec.multipart.FilePart
import reactor.core.publisher.Mono

object ControllerUtils {

    fun getBpmnXmlMono(file: FilePart): Mono<String> {
        return DataBufferUtils
            .join(file.content())
            .map { dataBuffer ->
                dataBuffer.asInputStream().bufferedReader().use { it.readText() }
            }
    }

    inline fun <reified T> resolveEnvironmentVariables(objectToResolve: T?, env: Environment): T? {
        return objectToResolve.let {
            jacksonObjectMapper().readValue<T>(
                env.resolvePlaceholders(jacksonObjectMapper().writeValueAsString(it))
            )
        }
    }
}
package de.mertendieckmann.griplbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(
	exclude = [DataSourceAutoConfiguration::class]
)
class GriplBackendApplication

fun main(args: Array<String>) {
	runApplication<GriplBackendApplication>(*args)
}

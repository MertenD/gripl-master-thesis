package de.mertendieckmann.griplbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class GriplBackendApplication

fun main(args: Array<String>) {
	runApplication<GriplBackendApplication>(*args)
}

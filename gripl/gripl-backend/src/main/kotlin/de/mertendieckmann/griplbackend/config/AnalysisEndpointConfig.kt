package de.mertendieckmann.griplbackend.config

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import de.mertendieckmann.griplbackend.model.dto.AnalysisEndpoint
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader

@Configuration
class AnalysisEndpointsConfig(
    private val loader: ResourceLoader
) {

    @Bean(name = ["analysisEndpoints"])
    fun analysisEndpoints(): List<AnalysisEndpoint> {
        val resource = loader.getResource("classpath:analysis-endpoints.json")
        return jacksonObjectMapper().readValue(resource.inputStream)
    }
}
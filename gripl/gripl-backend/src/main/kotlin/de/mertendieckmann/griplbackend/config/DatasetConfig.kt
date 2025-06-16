package de.mertendieckmann.griplbackend.config

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader

@Configuration
class DatasetConfig(
    private val loader: ResourceLoader
) {

    @Bean
    fun dataset(): List<EvaluationData> {
        val resource = loader.getResource("classpath:dataset.json")
        return jacksonObjectMapper().readValue(resource.inputStream)
    }
}
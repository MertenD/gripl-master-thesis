package de.mertendieckmann.griplbackend.config

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader

@Configuration
class DatasetConfig(
    private val evaluationDataRepository: EvaluationDataRepository,
    private val loader: ResourceLoader
) {
    @Bean(name = ["databaseDataset"])
    fun databaseDataset(): List<EvaluationData> {
        return evaluationDataRepository.getAllEvaluationData()
    }

    @Bean(name = ["fileDataset"])
    fun fileDataset(): List<EvaluationData> {
        val resource = loader.getResource("classpath:dataset.json")
        return jacksonObjectMapper().readValue(resource.inputStream)
    }
}
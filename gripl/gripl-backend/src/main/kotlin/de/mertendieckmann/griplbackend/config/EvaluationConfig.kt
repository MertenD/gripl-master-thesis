package de.mertendieckmann.griplbackend.config

import de.mertendieckmann.griplbackend.evaluation.EvaluationRunner
import de.mertendieckmann.griplbackend.evaluation.MultiEvaluationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class EvaluationConfig {
    @Bean
    fun multiEvaluationRunner(singleRunner: EvaluationRunner) =
        MultiEvaluationRunner(singleRunner)
}
package de.mertendieckmann.griplbackend.evaluation

import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ModelReportEnvelope
import de.mertendieckmann.griplbackend.model.dto.MultiEvaluationRequest
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

class MultiEvaluationRunner(
    private val singleRunner: EvaluationRunner
) {
    private val log = KotlinLogging.logger {}

    fun runAll(request: MultiEvaluationRequest): Flow<ModelReportEnvelope> = flow {
        require(request.models.isNotEmpty()) { "models must not be empty" }

        for ((index, model) in request.models.withIndex()) {
            val effectiveEndpoint = model.evaluationEndpoint ?: request.defaultEvaluationEndpoint
            log.info { "Starting model ${index + 1}/${request.models.size}: '${model.label}' @ $effectiveEndpoint" }

            val singleRequest = EvaluationRequest(
                evaluationEndpoint = effectiveEndpoint,
                llmProps = model.llmProps,
                maxConcurrent = request.maxConcurrent
            )

            singleRunner.run(singleRequest)
                .map { event -> ModelReportEnvelope(model.label, event) }
                .collect { wrapped -> emit(wrapped) }

            log.info { "Finished model '${model.label}'" }
        }
    }
}
package de.mertendieckmann.griplbackend.evaluation

import de.mertendieckmann.griplbackend.model.dto.EvaluationMetadataReport
import de.mertendieckmann.griplbackend.model.dto.EvaluationRequest
import de.mertendieckmann.griplbackend.model.dto.ModelReportEnvelope
import de.mertendieckmann.griplbackend.model.dto.MultiEvaluationRequest
import de.mertendieckmann.griplbackend.repository.DatasetRepository
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.security.MessageDigest

class MultiEvaluationRunner(
    private val singleRunner: EvaluationRunner,
    private val datasetRepository: DatasetRepository,
    private val evaluationDataRepository: EvaluationDataRepository
) {
    private val log = KotlinLogging.logger {}

    fun runAll(request: MultiEvaluationRequest): Flow<ModelReportEnvelope> = flow {
        require(request.models.isNotEmpty()) { "models must not be empty" }

        val baseSeed = request.seed ?: (System.currentTimeMillis() * (Math.random() * 10) % Int.MAX_VALUE).toInt()
        val repetitions = request.repetitions.coerceAtLeast(1)
        emit(ModelReportEnvelope("", createMetadata(request, baseSeed, repetitions), 1))

        for (runNumber in 1..repetitions) {
            log.info { "Starting evaluation run $runNumber/$repetitions" }

            for ((index, model) in request.models.withIndex()) {
                val effectiveEndpoint = model.evaluationEndpoint ?: request.defaultEvaluationEndpoint
                log.info { "Run $runNumber - Starting model ${index + 1}/${request.models.size}: '${model.label}' @ $effectiveEndpoint" }

                val runSeed = deriveRunSeed(baseSeed, runNumber)

                val singleRequest = EvaluationRequest(
                    evaluationEndpoint = effectiveEndpoint,
                    llmProps = model.llmProps?.copy(seed = runSeed),
                    maxConcurrent = request.maxConcurrent,
                    datasets = request.datasets
                )

                singleRunner.run(singleRequest)
                    .map { event -> ModelReportEnvelope(model.label, event, runNumber) }
                    .collect { wrapped -> emit(wrapped) }

                log.info { "Run $runNumber - Finished model '${model.label}'" }
            }
        }
    }

    private fun createMetadata(request: MultiEvaluationRequest, seed: Int, repetitions: Int): EvaluationMetadataReport {
        val datasets = datasetRepository.getDatasetsByIds(request.datasets.map { it.toLong() })
        val totalTestCases = evaluationDataRepository.countEvaluationDataForDatasets(request.datasets.map { it.toLong() })

        return EvaluationMetadataReport(
            modelLabels = request.models.map { it.label },
            modelTemperatures = request.models.map { it.llmProps?.temperature },
            modelTopPs = request.models.map { it.llmProps?.topP },
            datasets = datasets.map { EvaluationMetadataReport.DatasetInfo(it.id, it.name) },
            totalTestCases = totalTestCases,
            seed = seed,
            defaultEvaluationEndpoint = request.defaultEvaluationEndpoint,
            totalRepetitions = repetitions
        )
    }

    /**
     * Stable and deterministic derivation of a run-specific seed from a base seed and the run number.
     * The result is guaranteed to be in the range [1..Int.MAX_VALUE].
     */
    private fun deriveRunSeed(baseSeed: Int, runNumber: Int): Int {
        val digest = MessageDigest.getInstance("SHA-256")
        val payload = ByteBuffer.allocate(8).order(ByteOrder.BIG_ENDIAN)
            .putInt(baseSeed)
            .putInt(runNumber)
            .array()
        val hash = digest.digest(payload)
        val raw = ByteBuffer.wrap(hash, 0, 4).order(ByteOrder.BIG_ENDIAN).int
        val position = raw and 0x7fffffff
        return if (position == 0) 1 else position
    }
}
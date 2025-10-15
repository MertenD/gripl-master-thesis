package de.mertendieckmann.griplbackend.evaluation

import de.mertendieckmann.griplbackend.evaluation.metrics.MetricsAccumulator
import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import de.mertendieckmann.griplbackend.model.dto.*
import de.mertendieckmann.griplbackend.model.evaluation.EvaluationMetrics
import de.mertendieckmann.griplbackend.model.evaluation.EvaluationOutcome
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import org.springframework.stereotype.Component
import java.util.concurrent.atomic.AtomicInteger

@Component
class EvaluationRunner(
    private val evaluationDataRepository: EvaluationDataRepository,
    private val evaluator: Evaluator
) {

    private val log = KotlinLogging.logger {}

    @OptIn(ExperimentalCoroutinesApi::class)
    fun run(request: EvaluationRequest): Flow<EvaluationReport> {
        val metricsAccumulator = MetricsAccumulator()
        val startedCounter = AtomicInteger(0)

        val entriesFlow = evaluationDataRepository.getEvaluationDataByDatasetIdsOrAll(request.datasets)
            .sortedBy { it.id }.asFlow()

        log.info { "Starting evaluation with endpoint=${request.evaluationEndpoint}; maxConcurrent=${request.maxConcurrent}" }

        return entriesFlow
            .flatMapMerge(concurrency = request.maxConcurrent.coerceAtLeast(1)) { entry ->
                flow {
                    val currentNumber = startedCounter.incrementAndGet()
                    emit(buildStepInfo(entry, currentNumber, entriesFlow.count()))

                    when (val outcome = evaluateSingleEntry(entry, request)) {
                        is EvaluationOutcome.Error -> {
                            metricsAccumulator.addError()
                            emit(outcome.errorReport)
                        }
                        is EvaluationOutcome.Success -> {
                            metricsAccumulator.add(outcome.metrics)
                            emit(outcome.testCaseReport)
                        }
                    }
                }
            }
            .onCompletion {
                emit(metricsAccumulator.toSummary())
            }
    }

    private suspend fun evaluateSingleEntry(
        entry: EvaluationData,
        evaluationRequest: EvaluationRequest
    ): EvaluationOutcome = try {
        val expectedActivityIds = entry.expectedValues.map { it.value }
        val actualResult = evaluator.evaluate(entry.bpmnXml, evaluationRequest)
        val actualActivityIds = actualResult.first.map { it.value }

        val bpmnModel = parseBpmn(entry.bpmnXml)

        val classification = computeClassificationSets(expectedActivityIds, actualActivityIds)
        val trueNegativesCount = computeTrueNegativesCount(
            bpmnModel = bpmnModel,
            truePositivesCount = classification.truePositiveIds.size,
            falsePositivesCount = classification.falsePositiveIds.size,
            falseNegativesCount = classification.falseNegativeIds.size
        )

        val metrics = EvaluationMetrics(
            truePositives = classification.truePositiveIds.size,
            falsePositives = classification.falsePositiveIds.size,
            falseNegatives = classification.falseNegativeIds.size,
            trueNegatives = trueNegativesCount,
            isSuccessful = actualActivityIds.toSet() == expectedActivityIds.toSet(),
            amountOfRetries = actualResult.second
        )

        val testCaseReport = TestCaseReport(
            testCaseId = entry.id,
            testCaseName = entry.name,
            datasetId = entry.datasetId,
            imageSrc = buildPreviewUrl(
                testCaseId = entry.id,
                correctActivityIds = classification.truePositiveIds,
                falsePositiveIds = classification.falsePositiveIds,
                falseNegativeIds = classification.falseNegativeIds
            ),
            correctActivityIds = classification.truePositiveIds,
            falsePositiveIds = classification.falsePositiveIds,
            falseNegativeIds = classification.falseNegativeIds,
            expectedNamesWithIds = getNamesWithIds(bpmnModel, expectedActivityIds),
            actualNamesWithIds = getNamesWithIds(bpmnModel, actualActivityIds),
            isSuccessful = metrics.isSuccessful,
            result = actualResult.first,
            amountOfRetries = actualResult.second
        )

        EvaluationOutcome.Success(testCaseReport, metrics)

    } catch (e: Exception) {
        EvaluationOutcome.Error(
            EvaluationReportError(
                testCaseId = entry.id,
                datasetId = entry.datasetId,
                testCaseName = entry.name ?: "Test Case ${entry.id}",
                errorMessage = e.message ?: "Unbekannter Fehler aufgetreten"
            )
        )
    }
}
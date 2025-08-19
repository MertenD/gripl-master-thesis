package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.evaluation.service.HttpEvaluator
import de.mertendieckmann.griplbackend.model.dto.*
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.model.bpmn.Bpmn
import org.camunda.bpm.model.bpmn.instance.Activity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import kotlin.math.floor

@Component
class EvaluationRunner(
    @Qualifier("databaseDataset") private val dataset: List<EvaluationData>,
    private val evaluator: HttpEvaluator
) {
    private val log = KotlinLogging.logger { }

    suspend fun run(evaluationEndpoint: String, emitReport: suspend (EvaluationReport) -> Unit) {
        log.info { "Starting evaluation with endpoint: $evaluationEndpoint" }

        var total = 0
        var passed = 0
        var error = 0
        var totalTruePositives = 0
        var totalFalsePositives = 0
        var totalFalseNegatives = 0
        var totalTrueNegatives = 0

        dataset.sortedBy { it.id }.forEach { entry ->
            total++

            emitReport(EvaluationReportStepInfo(
                currentTestCaseName = entry.name ?: "Test Case ${entry.id}",
                currentTestCaseNumber = total,
                totalTestCases = dataset.size,
            ))

            val evaluationResult = try {
                evaluator.evaluate(entry.bpmnXml, evaluationEndpoint)
            } catch (e: Exception) {
                error++
                emitReport(EvaluationReportError(
                    testCaseId = entry.id,
                    testCaseName = entry.name ?: "Test Case ${entry.id}",
                    errorMessage = e.message ?: "Unbekannter Fehler aufgetreten"
                ))
                return@forEach
            }

            val isSuccessful = evaluationResult.map { it.value }.toSet() == entry.expectedValues.map { it.value }.toSet()
            if (isSuccessful) {
                passed++
            }

            val correctActivityIds = entry.expectedValues.map { it.value }.filter {
                evaluationResult.map { res -> res.value }.contains(it)
            }

            val falsePositiveIds = evaluationResult
                .filter { it.value !in entry.expectedValues.map { ev -> ev.value } }
                .map { it.value }

            val falseNegativeIds = entry.expectedValues
                .filter { it.value !in evaluationResult.map { res -> res.value } }
                .map { it.value }

            val truePositives = correctActivityIds.size
            val falsePositives = falsePositiveIds.size
            val falseNegatives = falseNegativeIds.size

            val bpmnModel = Bpmn.readModelFromStream(entry.bpmnXml.byteInputStream())
            val allActivityIds = bpmnModel.getModelElementsByType(Activity::class.java).map { it.id }
            val trueNegatives = allActivityIds.size - truePositives - falsePositives - falseNegatives

            totalTruePositives += truePositives
            totalFalsePositives += falsePositives
            totalFalseNegatives += falseNegatives
            totalTrueNegatives += trueNegatives

            val imageSrc = StringBuilder()
                .append("https://gripl.mertendieckmann.de/api/dataset/${entry.id}/preview")
                .append("?correctIds=${correctActivityIds.joinToString(",")}")
                .append("&falsePositiveIds=${falsePositiveIds.joinToString(",")}")
                .append("&falseNegativeIds=${falseNegativeIds.joinToString(",")}")
                // The salt is there to prevent caching of the image in for example GitHub and is just an arbitrary number
                .append("&salt=${floor(Math.random() * 99999)}")
                .toString()

            val expectedNamesWithIds = entry.expectedValues.map {
                bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
            }

            val actualNamesWithIds = evaluationResult.map {
                bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
            }

            val result = TestCaseReport(
                testCaseId = entry.id,
                testCaseName = entry.name,
                imageSrc = imageSrc,
                correctActivityIds = correctActivityIds,
                falsePositiveIds = falsePositiveIds,
                falseNegativeIds = falseNegativeIds,
                expectedNamesWithIds = expectedNamesWithIds,
                actualNamesWithIds = actualNamesWithIds,
                isSuccessful = isSuccessful,
                result = evaluationResult
            )

            emitReport(result)
        }

        val precision = if (totalTruePositives + totalFalsePositives > 0) {
            totalTruePositives.toDouble() / (totalTruePositives + totalFalsePositives)
        } else 0.0

        val recall = if (totalTruePositives + totalFalseNegatives > 0) {
            totalTruePositives.toDouble() / (totalTruePositives + totalFalseNegatives)
        } else 0.0

        val f1Score = if (precision + recall > 0) {
            2 * (precision * recall) / (precision + recall)
        } else 0.0

        val accuracy = if (totalTruePositives + totalFalsePositives + totalFalseNegatives + totalTrueNegatives > 0) {
            (totalTruePositives + totalTrueNegatives).toDouble() /
                    (totalTruePositives + totalFalsePositives + totalFalseNegatives + totalTrueNegatives)
        } else 0.0

        val summary = EvaluationReportSummary(
            total = total,
            passed = passed,
            failed = total - passed - error,
            error = error,
            precision = precision,
            recall = recall,
            f1Score = f1Score,
            accuracy = accuracy,
            totalTruePositives = totalTruePositives,
            totalFalsePositives = totalFalsePositives,
            totalFalseNegatives = totalFalseNegatives,
            totalTrueNegatives = totalTrueNegatives
        )
        emitReport(summary)
    }
}
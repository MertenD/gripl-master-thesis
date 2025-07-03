package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import de.mertendieckmann.griplbackend.model.dto.*
import org.camunda.bpm.model.bpmn.Bpmn
import org.camunda.bpm.model.bpmn.instance.Activity
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import kotlin.math.floor

@Component
class EvaluationRunner(
    @Qualifier("databaseDataset") private val dataset: List<EvaluationData>,
    private val evaluator: Evaluator
) {
    suspend fun run(emitReport: suspend (EvaluationReport) -> Unit) {
        var total = 0
        var passed = 0

        dataset.sortedBy { it.id }.forEach { entry ->
            total++

            emitReport(EvaluationReportStepInfo(
                currentTestCaseName = entry.name ?: "Test Case ${entry.id}",
                currentTestCaseNumber = total,
                totalTestCases = dataset.size,
            ))

            val evaluationResult = evaluator.evaluate(entry.bpmnXml)

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

            val imageSrc = StringBuilder()
                .append("https://gripl.mertendieckmann.de/api/dataset/${entry.id}/preview")
                .append("?correctIds=${correctActivityIds.joinToString(",")}")
                .append("&falsePositiveIds=${falsePositiveIds.joinToString(",")}")
                .append("&falseNegativeIds=${falseNegativeIds.joinToString(",")}")
                // The salt is there to prevent caching of the image in for example GitHub and is just an arbitrary number
                .append("&salt=${floor(Math.random() * 99999)}")
                .toString()

            val bpmnModel = Bpmn.readModelFromStream(entry.bpmnXml.byteInputStream())

            val expectedNamesWithIds = entry.expectedValues.map {
                bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
            }

            val actualNamesWithIds = evaluationResult.map {
                bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
            }

            val result = TestCaseReport(
                testVaseId = entry.id,
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

        val summary = EvaluationReportSummary(
            total = total,
            passed = passed,
            failed = total - passed
        )
        emitReport(summary)
    }
}
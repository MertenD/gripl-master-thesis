package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
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
    fun run(): String {
        val markdown = StringBuilder()
        var total = 0
        var passed = 0

        dataset.sortedBy { it.id }.forEach { entry ->
            total++

            val evaluationResult = evaluator.evaluate(entry.bpmnXml)

            val isSuccessful = evaluationResult.map { it.value }.toSet() == entry.expectedValues.map { it.value }.toSet()
            if (isSuccessful) {
                passed++
            }

            buildMarkdownForCase(markdown, entry, evaluationResult)
        }

        markdown
            .append("## Summary\n")
            .append("Total: $total\n")
            .append("Passed: $passed\n")
            .append("Failed: ${total - passed}\n")

        return markdown.toString()
    }

    fun buildMarkdownForCase(markdown: StringBuilder, entry: EvaluationData, evaluationResult: List<ExpectedValue>) {
        val bpmnModel = Bpmn.readModelFromStream(entry.bpmnXml.byteInputStream())

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

        val expectedNamesWithIds = entry.expectedValues.map {
            bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
        }

        val actualNamesWithIds = evaluationResult.map {
            bpmnModel.getModelElementById<Activity>(it.value).name + " (${it.value})"
        }

        markdown
            .append("## Test Case ${entry.id}${if (entry.name !== null) " - ${entry.name}" else ""}\n")
            .append("<img src=\"$imageSrc\" alt=\"Test Case BPMN XML\" height=\"200\" />\n\n")
            .append("- **Expected:** ${expectedNamesWithIds.joinToString(", ") { it }}\n")
            .append("- **Actual:** ${actualNamesWithIds.joinToString(", ") { it }}\n")
            .append("- **Result:** ${if (actualNamesWithIds.toSet() == expectedNamesWithIds.toSet()) "✅ Passed" else "❌ Failed"}\n\n")
            .append("<details>\n")
            .append("<summary><h3>Reasoning of the LLM</h3></summary>\n\n")

        evaluationResult.forEach { result ->
            val activity = bpmnModel.getModelElementById<Activity>(result.value)
            val activityName = activity.name ?: "Unnamed Activity"
            val activityId = activity.id
            val reason = result.reason ?: "No reason provided"

            markdown.append("- **$activityName** ($activityId): ${reason}\n")
        }

        markdown.append("\n</details>\n\n")
    }
}
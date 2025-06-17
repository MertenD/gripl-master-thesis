package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

@Component
class EvaluationRunner(
    @Qualifier("databaseDataset") private val dataset: List<EvaluationData>,
    private val evaluator: Evaluator
) {
    fun run(): String {
        val markdown = StringBuilder()
        var total = 0
        var passed = 0

        dataset.forEach { entry ->
            total++

            val evaluationResult = evaluator.evaluate(entry.bpmnXml)

            val isSuccessful = evaluationResult.map { it.value }.toSet() == entry.expectedValues.map { it.value }.toSet()
            if (isSuccessful) {
                passed++
            }

            markdown
                .append("## Test Case ${entry.id}\n")
                .append("**Input:** <img src=\"https://gripl.mertendieckmann.de/api/dataset/${entry.id}/preview\" alt=\"Test Case BPMN XML\" height=\"200\" />\n")
                .append("**Expected:** ${entry.expectedValues.joinToString(", ") { it.value }}\n")
                .append("**Actual:** ${evaluationResult.joinToString(", ") { it.value }}\n")
                .append("**Result:** ${if (isSuccessful) "✅ Passed" else "❌ Failed"}\n\n")
        }

        markdown
            .append("## Summary\n")
            .append("Total: $total\n")
            .append("Passed: $passed\n")
            .append("Failed: ${total - passed}\n")

        return markdown.toString()
    }
}
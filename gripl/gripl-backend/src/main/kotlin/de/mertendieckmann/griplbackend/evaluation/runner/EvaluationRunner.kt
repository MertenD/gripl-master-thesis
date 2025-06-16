package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
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

        dataset.forEachIndexed { i, entry ->
            total++

            val evaluationResult = evaluator.evaluate(entry.bpmnXml)

            val isSuccessful = evaluationResult.map { it.value }.toSet() == entry.expectedValues.map { it.value }.toSet()
            if (isSuccessful) {
                passed++
            }

            markdown
                .append("## Test Case ${i + 1}\n")
                .append("**Input:** `${entry.bpmnXml}`\n")
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
package de.mertendieckmann.griplbackend.evaluation.runner

import de.mertendieckmann.griplbackend.model.DatasetEntry
import de.mertendieckmann.griplbackend.evaluation.service.Evaluator
import org.springframework.stereotype.Component

@Component
class EvaluationRunner(
    private val dataset: List<DatasetEntry>,
    private val evaluator: Evaluator
) {
    fun run(): String {
        val markdown = StringBuilder()
        var total = 0
        var passed = 0

        dataset.forEachIndexed { i, entry ->
            total++

            val evaluationResult = evaluator.evaluate(entry.input)

            val isSuccessful = evaluationResult.map { it.value }.toSet() == entry.expected.map { it.value }.toSet()
            if (isSuccessful) {
                passed++
            }

            markdown
                .append("## Test Case ${i + 1}\n")
                .append("**Input:** `${entry.input}`\n")
                .append("**Expected:** ${entry.expected.joinToString(", ") { it.value }}\n")
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
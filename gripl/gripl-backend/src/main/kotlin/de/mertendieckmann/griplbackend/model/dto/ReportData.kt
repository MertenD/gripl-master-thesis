package de.mertendieckmann.griplbackend.model.dto

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(TestCaseReport::class, name = "testCase"),
    JsonSubTypes.Type(EvaluationReportSummary::class, name = "summary"),
    JsonSubTypes.Type(EvaluationReportStepInfo::class, name = "stepInfo"),
    JsonSubTypes.Type(EvaluationReportError::class, name = "error")
)
sealed class EvaluationReport{
    val markdown: String by lazy { toMarkdown() }
    abstract fun toMarkdown(): String
}

data class TestCaseReport(
    val testCaseId: Long,
    val testCaseName: String? = null,
    val imageSrc: String,
    val correctActivityIds: List<String>,
    val falsePositiveIds: List<String>,
    val falseNegativeIds: List<String>,
    val expectedNamesWithIds: List<String>,
    val actualNamesWithIds: List<String>,
    val isSuccessful: Boolean,
    val result: List<ExpectedValue>
): EvaluationReport() {

    override fun toMarkdown(): String {
        return """
            |## Test Case $testCaseId${if (testCaseName != null) " - $testCaseName" else ""}
            |<img src="$imageSrc" alt="Test Case BPMN XML" />
            |
            |- **Expected:** ${expectedNamesWithIds.joinToString(", ")}
            |- **Actual:** ${actualNamesWithIds.joinToString(", ")}
            |- **Result:** ${if (isSuccessful) "✅ Passed" else "❌ Failed"}
            |
            |<details>
            |<summary><h3>Reasoning of the LLM</h3></summary>
            |
            |${result.joinToString("\n") { res -> "- **${actualNamesWithIds.find { it.contains(res.value) } ?: res.value}**: ${res.reason ?: "No reason provided"}" }}
            |
            |</details>
        """.trimMargin()
    }
}

data class EvaluationReportSummary(
    val total: Int,
    val passed: Int,
    val failed: Int,
    val error: Int,
    val precision: Double,
    val recall: Double,
    val f1Score: Double,
    val accuracy: Double,
    val totalTruePositives: Int,
    val totalFalsePositives: Int,
    val totalFalseNegatives: Int,
    val totalTrueNegatives: Int
): EvaluationReport() {

    override fun toMarkdown(): String {
        return """
            |## Summary
            |Total: $total
            |Passed: $passed
            |Failed: $failed
            |${if (error > 0) "Error: $error" else ""}
            |
            |### Metrics
            |Accuracy: ${"%.3f".format(accuracy)}
            |Precision: ${"%.3f".format(precision)}
            |Recall: ${"%.3f".format(recall)}
            |F1-Score: ${"%.3f".format(f1Score)}
            |
            |### Confusion Matrix
            |True Positives: $totalTruePositives
            |False Positives: $totalFalsePositives
            |False Negatives: $totalFalseNegatives
            |True Negatives: $totalTrueNegatives
        """.trimMargin()
    }
}

data class EvaluationReportStepInfo(
    val currentTestCaseName: String,
    val currentTestCaseNumber: Int,
    val totalTestCases: Int,
): EvaluationReport() {
    override fun toMarkdown(): String {
        return """
            |## Step Info
            |Current Test Case: $currentTestCaseName
            |Test Case $currentTestCaseNumber of $totalTestCases
        """.trimMargin()
    }
}

data class EvaluationReportError(
    val testCaseId: Long,
    val testCaseName: String? = null,
    val errorMessage: String
): EvaluationReport() {

    override fun toMarkdown(): String {
        return """
            |## Error in Test Case ${if (testCaseName != null) "$testCaseName" else ""} ($testCaseId)
            |**Error Message:** $errorMessage
        """.trimMargin()
    }
}
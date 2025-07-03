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
    JsonSubTypes.Type(EvaluationReportStepInfo::class, name = "stepInfo")
)
sealed class EvaluationReport {
    abstract fun toMarkdown(): String
}

data class TestCaseReport(
    val testVaseId: Long,
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
            |## Test Case $testVaseId${if (testCaseName != null) " - $testCaseName" else ""}
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
    val failed: Int
): EvaluationReport() {
    override fun toMarkdown(): String {
        return """
            |## Summary
            |Total: $total
            |Passed: $passed
            |Failed: $failed
        """.trimMargin()
    }
}

data class EvaluationReportStepInfo(
    val currentTestCaseName: String,
    val currentTestCaseNumber: Int,
    val totalTestCases: Int,
): EvaluationReport() {
    override fun toMarkdown(): String {
        return ""
    }
}
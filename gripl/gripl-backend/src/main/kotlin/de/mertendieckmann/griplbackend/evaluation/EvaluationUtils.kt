package de.mertendieckmann.griplbackend.evaluation

import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.model.dto.EvaluationReportStepInfo
import de.mertendieckmann.griplbackend.model.evaluation.ClassificationSets
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.camunda.bpm.model.bpmn.Bpmn
import org.camunda.bpm.model.bpmn.BpmnModelInstance
import org.camunda.bpm.model.bpmn.instance.Activity
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import kotlin.math.floor

suspend fun parseBpmn(xml: String): BpmnModelInstance =
    withContext(Dispatchers.Default) { Bpmn.readModelFromStream(xml.byteInputStream()) }

fun computeClassificationSets(
    expectedIds: List<String>,
    actualIds: List<String>
): ClassificationSets {
    val expected = expectedIds.toSet()
    val actual = actualIds.toSet()
    val truePositiveIds = expected.intersect(actual).toList()
    val falsePositiveIds = (actual - expected).toList()
    val falseNegativeIds = (expected - actual).toList()
    return ClassificationSets(truePositiveIds, falsePositiveIds, falseNegativeIds)
}

fun computeTrueNegativesCount(
    bpmnModel: BpmnModelInstance,
    truePositivesCount: Int,
    falsePositivesCount: Int,
    falseNegativesCount: Int
): Int {
    val totalActivities = bpmnModel.getModelElementsByType(Activity::class.java).size
    return (totalActivities - truePositivesCount - falsePositivesCount - falseNegativesCount)
        .coerceAtLeast(0)
}

fun getNamesWithIds(model: BpmnModelInstance, ids: List<String>): List<String> =
    ids.mapNotNull { id ->
        val name = model.getModelElementById<Activity>(id)?.name ?: return@mapNotNull null
        "$name ($id)"
    }

fun buildPreviewUrl(
    testCaseId: Long,
    correctActivityIds: List<String>,
    falsePositiveIds: List<String>,
    falseNegativeIds: List<String>
): String {
    fun enc(xs: List<String>) = xs.joinToString(",") { URLEncoder.encode(it, StandardCharsets.UTF_8) }
    return buildString {
        append("https://gripl.mertendieckmann.de/api/dataset/testcase/$testCaseId/preview")
        append("?correctIds=${enc(correctActivityIds)}")
        append("&falsePositiveIds=${enc(falsePositiveIds)}")
        append("&falseNegativeIds=${enc(falseNegativeIds)}")
        append("&salt=${floor(Math.random() * 99999)}")
    }
}

fun buildStepInfo(entry: EvaluationData, number: Int, total: Int) =
    EvaluationReportStepInfo(
        currentTestCaseName = entry.name ?: "Test Case ${entry.id}",
        currentTestCaseId = entry.id,
        currentTestCaseNumber = number,
        totalTestCases = total
    )
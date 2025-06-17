package de.mertendieckmann.griplbackend.model.dto

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

data class EvaluationData(
    val id: Long,
    val name: String?,
    val bpmnXml: String,
    val expectedValues: List<ExpectedValue>
) {
    companion object {
        private val mapper = jacksonObjectMapper()

        fun fromRow(id: Long, name: String?, bpmnXml: String, expectedJson: String): EvaluationData {
            val list: List<ExpectedValue> = mapper.readValue(expectedJson)
            return EvaluationData(
                id = id,
                name = name,
                bpmnXml = bpmnXml,
                expectedValues = list
            )
        }
    }
}

data class ExpectedValue(
    val value: String,
    val reason: String? = null
)
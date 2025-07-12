package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.dto.ExpectedValue
import kotlin.jvm.Throws

interface Evaluator {
    @Throws(Exception::class)
    fun evaluate(bpmnXml: String): List<ExpectedValue>
}
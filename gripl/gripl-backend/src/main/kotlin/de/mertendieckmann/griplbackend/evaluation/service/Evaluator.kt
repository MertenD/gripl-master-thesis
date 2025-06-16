package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.dto.ExpectedValue

interface Evaluator {
    fun evaluate(input: String): List<ExpectedValue>
}
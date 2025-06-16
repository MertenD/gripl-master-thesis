package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.model.ExpectedResult

interface Evaluator {
    fun evaluate(input: String): List<ExpectedResult>
}
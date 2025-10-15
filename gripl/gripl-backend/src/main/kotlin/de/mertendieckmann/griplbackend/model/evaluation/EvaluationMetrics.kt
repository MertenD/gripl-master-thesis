package de.mertendieckmann.griplbackend.model.evaluation

data class EvaluationMetrics(
    val truePositives: Int,
    val falsePositives: Int,
    val falseNegatives: Int,
    val trueNegatives: Int,
    val isSuccessful: Boolean,
    val amountOfRetries: Int? = null
)
package de.mertendieckmann.griplbackend.model.evaluation

data class ClassificationSets(
    val truePositiveIds: List<String>,
    val falsePositiveIds: List<String>,
    val falseNegativeIds: List<String>
)
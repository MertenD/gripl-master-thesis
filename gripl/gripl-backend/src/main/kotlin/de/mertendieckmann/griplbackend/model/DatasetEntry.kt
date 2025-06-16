package de.mertendieckmann.griplbackend.model

data class DatasetEntry(
    val input: String,
    val expected: List<ExpectedResult>
)

data class ExpectedResult(
    val value: String
)
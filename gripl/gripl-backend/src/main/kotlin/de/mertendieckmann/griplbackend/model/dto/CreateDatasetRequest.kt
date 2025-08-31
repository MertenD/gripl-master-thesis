package de.mertendieckmann.griplbackend.model.dto

data class CreateDatasetRequest(
    val name: String,
    val description: String? = null
)
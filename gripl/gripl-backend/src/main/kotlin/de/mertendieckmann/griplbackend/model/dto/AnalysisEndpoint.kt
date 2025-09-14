package de.mertendieckmann.griplbackend.model.dto

// TODO Add Description
// TODO Allow full URLS, not just relative endpoints
// TODO Add Database Table for further external endpoints that should be available in the App per Default
// TODO Show description in frontend

data class AnalysisEndpoint(
    val name: String,
    val endpoint: String
)
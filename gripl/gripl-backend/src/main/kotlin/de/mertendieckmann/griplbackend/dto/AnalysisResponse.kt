package de.mertendieckmann.griplbackend.dto

typealias ActivityElementId = String

data class AnalysisResponse (
    val activityElementIds: List<ActivityElementId>
)
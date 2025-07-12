package de.mertendieckmann.griplbackend.model.dto

data class PreviewCache(
    val id: Long,
    val evaluationDataId: Long,
    val urlCacheKey: String,
    val svg: String
)

data class PreviewCacheInsert(
    val evaluationDataId: Long,
    val urlCacheKey: String,
    val svg: String
)
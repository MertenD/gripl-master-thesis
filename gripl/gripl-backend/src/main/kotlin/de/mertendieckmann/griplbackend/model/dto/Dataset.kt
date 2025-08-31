package de.mertendieckmann.griplbackend.model.dto

data class Dataset(
    val id: Long,
    val name: String,
    val description: String? = null,
    val createdAt: String,
    val updatedAt:String
) {
    companion object {

        fun fromRow(id: Long, name: String, description: String?, createdAt: String, updatedAt: String): Dataset {
            return Dataset(
                id = id,
                name = name,
                description = description,
                createdAt = createdAt,
                updatedAt = updatedAt
            )
        }
    }
}
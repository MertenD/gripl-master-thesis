package de.mertendieckmann.griplbackend.model

import org.camunda.bpm.model.xml.type.ModelElementType

data class BpmnElement(
    val type: ModelElementType,
    val id: String,
    val documentation: String? = null,
    val name: String? = null,
    val outgoingFlowElementIds: List<String> = emptyList(),
    val incomingFlowElementIds: List<String> = emptyList(),
    val incomingDataFromElementIds: List<String> = emptyList(),
    val outgoingDataToElementIds: List<String> = emptyList(),
    val associatedElementIds: List<String> = emptyList()
)
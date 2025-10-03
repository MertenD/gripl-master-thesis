package de.mertendieckmann.griplbackend.model

data class BpmnElement(
    val type: String,
    val id: String,
    val name: String? = null,
    val documentation: String? = null,
    val poolName: String? = null,
    val laneName: String? = null,
    val outgoingFlowElementIds: List<String> = emptyList(),
    val incomingFlowElementIds: List<String> = emptyList(),
    val outgoingMessageFlowsToElementIds: List<String> = emptyList(),
    val incomingMessageFlowsFromElementIds: List<String> = emptyList(),
    val incomingDataFromElementIds: List<String> = emptyList(),
    val outgoingDataToElementIds: List<String> = emptyList(),
    val associatedElementIds: List<String> = emptyList()
)
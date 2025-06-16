package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.model.BpmnElement
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.model.bpmn.Bpmn
import org.camunda.bpm.model.bpmn.instance.*

class BpmnExtractor {
    private val log = KotlinLogging.logger { }

    // TODO Maybe in the future i need to parse pools and lanes as well for information about who is executing which task

    fun extractBpmnElements(bpmnXml: String): Set<BpmnElement> {

        val bpmnModel = Bpmn.readModelFromStream(bpmnXml.byteInputStream())

        val elements = bpmnModel.getModelElementsByType(BaseElement::class.java).mapNotNull { element ->
            when (element) {
                is Activity -> {
                    val bpmnElement = BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = element.name,
                        documentation = element.documentations.joinToString { it.rawTextContent },
                        incomingFlowElementIds = element.incoming.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(it.id).source.id
                        },
                        outgoingFlowElementIds = element.outgoing.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(it.id).target.id
                        },
                        incomingDataFromElementIds = element.dataInputAssociations.flatMap { association ->
                            bpmnModel.getModelElementById<DataInputAssociation>(association.id).sources.mapNotNull { source -> source.id }
                        },
                        outgoingDataToElementIds = element.dataOutputAssociations.map { association ->
                            bpmnModel.getModelElementById<DataOutputAssociation>(association.id).target.id
                        },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java).filter { it.source == element }.mapNotNull {
                            it.target.id
                        }
                    )
                    bpmnElement
                }
                is FlowNode -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = element.name,
                        incomingFlowElementIds = element.incoming.mapNotNull { bpmnModel.getModelElementById<SequenceFlow>(it.id).source.id },
                        outgoingFlowElementIds = element.outgoing.mapNotNull { bpmnModel.getModelElementById<SequenceFlow>(it.id).target.id },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.source == element }
                            .mapNotNull { it.target.id }
                    )
                }
                is DataStoreReference, is DataObjectReference -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = when(element) {
                            is DataStoreReference -> element.name
                            is DataObjectReference -> element.name
                            else -> null
                        },
                        outgoingDataToElementIds = bpmnModel.getModelElementsByType(DataInputAssociation::class.java)
                            .filter { association -> association.sources.any { it.id === element.id } }
                            .mapNotNull {
                                when (val parent = it.parentElement) {
                                    is FlowElement -> parent.id
                                    else -> null
                                }
                            },
                        incomingDataFromElementIds = bpmnModel.getModelElementsByType(DataOutputAssociation::class.java)
                            .filter { association -> association.target.id === element.id }
                            .mapNotNull {
                                when (val parent = it.parentElement) {
                                    is FlowElement -> parent.id
                                    else -> null
                                }
                            },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.source == element }
                            .mapNotNull { it.target.id }
                    )
                }
                is TextAnnotation -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        documentation = element.textContent,
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.source.id == element.id }
                            .mapNotNull { it.target.id }
                            .plus(
                                bpmnModel.getModelElementsByType(Association::class.java)
                                    .filter { it.target.id == element.id }
                                    .mapNotNull { it.source.id }
                            )
                    )
                }
                else -> {
                    log.warn { "Unsupported BPMN element type: ${element.elementType.typeName}" }
                    null
                }
            }
        }

        return elements.toSet()
    }
}
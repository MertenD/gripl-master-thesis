package de.mertendieckmann.griplbackend.application

import de.mertendieckmann.griplbackend.model.BpmnElement
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.model.bpmn.Bpmn
import org.camunda.bpm.model.bpmn.instance.*
import org.camunda.bpm.model.xml.ModelParseException
import org.camunda.bpm.model.xml.ModelValidationException
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException

class BpmnExtractor {
    private val log = KotlinLogging.logger { }

    // TODO Maybe in the future i need to parse pools and lanes as well for information about who is executing which task

    /**
     * Extracts BPMN elements from the provided BPMN XML string.
     *
     * @param bpmnXml The BPMN XML as a string.
     * @return A set of [BpmnElement] representing the extracted BPMN elements.
     * @throws IllegalArgumentException if the BPMN XML is invalid.
     */
    fun extractBpmnElements(bpmnXml: String): Set<BpmnElement> {

        val bpmnModel = try {
            val bpmnModel = Bpmn.readModelFromStream(bpmnXml.byteInputStream())
            Bpmn.validateModel(bpmnModel)
            bpmnModel
        } catch (ex: Exception) {
            log.warn { "BPMN validation failed: ${ex.message}" }
            throw IllegalArgumentException("Invalid BPMN XML provided: ${ex.message}", ex)
        }

        val elements = bpmnModel.getModelElementsByType(BaseElement::class.java).mapNotNull { element ->
            when (element) {
                is Activity -> {
                    val bpmnElement = BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = element.name,
                        documentation = element.documentations.joinToString { it.rawTextContent },
                        incomingFlowElementIds = element.incoming.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(it.id).getAttributeValue("sourceRef")
                        },
                        outgoingFlowElementIds = element.outgoing.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(it.id).getAttributeValue("targetRef")
                        },
                        incomingDataFromElementIds = element.dataInputAssociations.flatMap { association ->
                            bpmnModel.getModelElementById<DataInputAssociation>(association.id).sources.mapNotNull { source -> source.id }
                        },
                        outgoingDataToElementIds = element.dataOutputAssociations.map { association ->
                            bpmnModel.getModelElementById<DataOutputAssociation>(association.id).getAttributeValue("targetRef")
                        },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.getAttributeValue("sourceRef") == element.id }.mapNotNull {
                                it.getAttributeValue("targetRef")
                            }
                    )
                    bpmnElement
                }

                is FlowNode -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = element.name,
                        incomingFlowElementIds = element.incoming.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(
                                it.id
                            ).getAttributeValue("sourceRef")
                        },
                        outgoingFlowElementIds = element.outgoing.mapNotNull {
                            bpmnModel.getModelElementById<SequenceFlow>(
                                it.id
                            ).getAttributeValue("targetRef")
                        },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.getAttributeValue("sourceRef") == element.id }
                            .mapNotNull { it.getAttributeValue("targetRef") }
                    )
                }

                is DataStoreReference, is DataObjectReference -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        name = when (element) {
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
                            .filter { association -> association.getAttributeValue("targetRef") === element.id }
                            .mapNotNull {
                                when (val parent = it.parentElement) {
                                    is FlowElement -> parent.id
                                    else -> null
                                }
                            },
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.getAttributeValue("sourceRef") == element.id }
                            .mapNotNull { it.getAttributeValue("targetRef") }
                    )
                }

                is TextAnnotation -> {
                    BpmnElement(
                        type = element.elementType,
                        id = element.id,
                        documentation = element.textContent,
                        associatedElementIds = bpmnModel.getModelElementsByType(Association::class.java)
                            .filter { it.getAttributeValue("sourceRef") == element.id }
                            .mapNotNull { it.getAttributeValue("targetRef") }
                            .plus(
                                bpmnModel.getModelElementsByType(Association::class.java)
                                    .filter { it.getAttributeValue("targetRef") == element.id }
                                    .mapNotNull { it.getAttributeValue("sourceRef") }
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
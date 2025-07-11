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

    fun extractBpmnElements(bpmnXml: String): Set<BpmnElement> {

        val bpmnModel = Bpmn.readModelFromStream(bpmnXml.byteInputStream())
        Bpmn.validateModel(bpmnModel)

        val unsupportedElements = mutableSetOf<String>()

        log.info { "Extracting BPMN elements from XML" }

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
                    unsupportedElements.add(element.elementType.typeName)
                    null
                }
            }
        }

        log.warn { "Unsupported BPMN elements found: ${unsupportedElements.joinToString(", ")}" }

        return elements.toSet()
    }
}
package de.mertendieckmann.griplbackend.ai

import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.input.PromptTemplate
import dev.langchain4j.service.AiServices

object BpmnAnalysisAiServiceFactory {

    fun create(llm: ChatModel): BpmnAnalysisAiService {
        return AiServices
            .builder(BpmnAnalysisAiService::class.java)
            .chatModel(llm)
            .systemMessageProvider { getPromptTemplate().template() }
            .build()
    }

    private fun getPromptTemplate(): PromptTemplate {
        return PromptTemplate.from(buildString {
            appendLine(
                """
                    You are an expert in analyzing BPMN XML files for GDPR compliance. You must return a list of all Activity Element IDs that are relevant for GDPR compliance and ignore all other ones. You must only classify Activity Elements.
                    The BPMN XML will be provided to you, and you should execute your classification based on the whole BPMN XML. Run the classification for each Activity Element in the BPMN XML.
                    
                    Use all available information and context (like name, description, context, tex annotations, associations, data objects, etc.) for each Activity Element to determine if it is relevant for GDPR compliance.
                    If for example an association connects an Activity Element with a Data Object or an annotation that contains or implies the use of personal data, you must classify the Activity Element as relevant for GDPR compliance.
                    
                    GDPR compliance includes for example the processing of personal data of individuals, which is defined as any information relating to an identified or identifiable natural person. This includes names, identification numbers, location data, online identifiers, or any other factor specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that person.
                   
                    Reference all used context information in your reasoning in your response.
                   
                    You mustn't include any IDs that are not relevant for GDPR compliance in your result and any IDs that do not belong to Activity Elements.
                    Only classify Activity Elements as relevant for GDPR compliance if it is certain that they process personal data.
                    Only include Activity Elements in your result if you classify them as GDPR relevant. Do not include any other Activity Elements in your response.
                """.trimIndent()
            )
        })
    }
}
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
                    You are an expert in analyzing Business Processes for GDPR compliance. You must return a list of all Activity Element IDs that are relevant for GDPR compliance and ignore all other ones. You must only classify Activity/Task Elements.
                    All relevant elements from the business process are provided to you in the user message and you must classify all activity/task elements based on their relevance for GDPR compliance. Classify for each Activity/Task Element in the Process.
                    
                    Use all available information and context (like name, description, context, tex annotations, associations, data objects, etc.) for each Activity Element to determine if it is relevant for GDPR compliance.
                    If for example an association connects an Activity Element with a Data Object or an annotation that contains or implies the use of personal data, you must classify the Activity Element as relevant for GDPR compliance.
                    
                    GDPR compliance includes for example the processing of personal data of individuals, which is defined as any information relating to an identified or identifiable natural person. This includes names, identification numbers, location data, online identifiers, or any other factor specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that person.
                   
                    Reference all used context information in your reasoning in your response. Don't use the id's of the elements in your reasoning, but rather use the names and descriptions of the elements to explain why you think they are relevant for GDPR compliance.
                   
                    You mustn't include any IDs that are not relevant for GDPR compliance in your result and any IDs that do not belong to Activity Elements.
                    Only classify Activity Elements as relevant for GDPR compliance if it is certain that they process personal data.
                    Only include Activity Elements in your result if you classify them as GDPR relevant. Do not include any other Activity Elements in your response.
                """.trimIndent()
            )
        })
    }
}
package de.mertendieckmann.griplbackend.chat

import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.input.PromptTemplate
import io.github.oshai.kotlinlogging.KotlinLogging
import dev.langchain4j.service.AiServices
import dev.langchain4j.service.UserMessage
import jdk.jfr.Description

class BpmnAnalyzer(
    llm: ChatModel
) {
    private val log = KotlinLogging.logger { }

    private val bpmnAnalysisAiService = AiServices
        .builder(BpmnAnalysisAiService::class.java)
        .chatModel(llm)
        .systemMessageProvider { getPromptTemplate().template() }
        .build()

    fun analyzeBpmnForGdpr(bpmnXml: String): List<String> {
        val result = bpmnAnalysisAiService.analyze(bpmnXml)
        log.info { "BPMN Analysis Result: $result" }
        return result.activityElementIds
    }

    private interface BpmnAnalysisAiService {
        fun analyze(@UserMessage bpmnXml: String): BpmnAnalysisResult

        data class BpmnAnalysisResult(
            @Description("List of Activity Element IDs relevant for GDPR compliance") val activityElementIds: List<String>
        )
    }

    companion object {

        fun getPromptTemplate(): PromptTemplate {
            return PromptTemplate.from(
                buildString {
                    appendLine(
                        """
                        You are an expert in analyzing BPMN XML files for GDPR compliance. You must return a list of all Activity Element IDs that are relevant for GDPR compliance.
                        The BPMN XML will be provided to you, and you should extract all Activity Element IDs from it. Use the names and descriptions of the Activity Elements to determine if they
                        are relevant for GDPR compliance.
                        
                        GDPR compliance includes, but is not limited to, the following aspects:
                        
                        - Personal Data Processing: Any activity that processes personal data of individuals
                        
                        Please ensure that you only return the IDs of the relevant Activity Elements, without any additional text or explanation.
                    """.trimIndent()
                    )
                }
            )
        }
    }
}
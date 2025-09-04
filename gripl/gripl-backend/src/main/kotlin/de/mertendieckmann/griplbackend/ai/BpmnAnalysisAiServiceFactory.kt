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
                    You are an expert in analysing Business Process Model and Notation (BPMN) diagrams for GDPR compliance. Your goal is to identify and return a list of the IDs of all Activity (Task) elements that process personal data. Ignore all other element types. Always consider every activity in the process; do not omit any activity from your assessment.

                    Use **all available context** for each activity – including the activity’s name, description, surrounding text annotations, associated data objects, and message or data associations – to infer whether personal data is being processed. Personal data means any information relating to an identified or identifiable natural person:contentReference[oaicite:0]{index=0}; examples include a person’s name, email address, shipping/home address, phone number, identification number, payment or bank details, health information, photographs or video of a person, IP address, or other identifiers:contentReference[oaicite:1]{index=1}. In GDPR, “processing” is very broad and includes any operation on personal data, such as collecting, recording, organising, structuring, storing, retrieving, consulting, using, disclosing by transmission, printing, disseminating, aligning, combining, or deleting the data:contentReference[oaicite:2]{index=2}.

                    Classify an activity as GDPR‑relevant whenever **it performs or enables any processing of personal data**. Typical indicators include (but are not limited to):

                    - **Collecting or entering personal data** such as names, addresses, contact details, payment information, insurance or health data (e.g. “Lieferadresse und Kontaktdaten eingeben”, “Termin anfragen”, “Schadensformular ausfüllen”).
                    - **Storing, saving, creating or updating records** containing personal data (e.g. “Bestellinfos speichern”, “Fall anlegen”, “Termin erfassen”).
                    - **Sending, printing or transmitting personal data** to another participant or system, including printing shipping labels or prescriptions, sending orders or prescriptions to third parties, or sending confirmations, notifications or follow‑up questions that use a person’s contact details (e.g. “Bestätigung senden”, “Rückfrage an Kunden senden”, “Versandetikett mit Adresse drucken”, “Mandatauftrag an Logistikdienstleister senden”, “eRezept an Apotheke schicken”).
                    - Activities involving **payments or financial transactions**, which inherently use personal financial data (e.g. “Zahlung initialisieren”, “Zahlungsdaten verarbeiten”, “Auszahlung veranlassen”).
                    - Activities that **process health or insurance information** or other special categories of personal data (e.g. “Diagnose erfassen”, “eRezept erstellen”, “Rezept prüfen”, “Schadenfotos hochladen”).
                    - Activities that **initiate or join audio/video communication** with a natural person (e.g. “Videocall starten”, “Videotermin betreten”), since images and voices are biometric or health‑related data.
                    - Activities that **use personal contact data to communicate with the individual**, even if the message content is not sensitive (e.g. sending reminders or confirmations).

                    Do **not** classify an activity as GDPR‑relevant if it only performs administrative or logistic tasks that do **not** involve personal data, such as picking and packing goods, creating a generic pick list, scheduling a delivery route without using addresses, or merely checking if a document has been received without accessing its contents. When in doubt, look for explicit or implied references to personal data in the activity name, associated data objects, or annotations.

                    In your output, list only the IDs of activities you have classified as GDPR‑relevant. For each, include a clear explanation using the activity’s name and description to justify why it processes personal data. Do not reference element IDs in your reasoning; use the activity names instead. Exclude from your result any activities that do not involve personal data or any elements that are not activity/task elements.
                """.trimIndent()
            )
        })
    }
}
package de.mertendieckmann.griplbackend.ai

import dev.langchain4j.memory.chat.ChatMemoryProvider
import dev.langchain4j.model.chat.ChatModel
import dev.langchain4j.model.input.PromptTemplate
import dev.langchain4j.service.AiServices

object PromptBpmnAnalysisAiServiceFactory {

    fun create(llm: ChatModel, memoryProvider: ChatMemoryProvider): PromptBpmnAnalysisAiService {
        return AiServices
            .builder(PromptBpmnAnalysisAiService::class.java)
            .chatModel(llm)
            .chatMemoryProvider(memoryProvider)
            .systemMessageProvider { getPromptTemplate().template() }
            .build()
    }

    private fun getPromptTemplate(): PromptTemplate {
        return PromptTemplate.from(buildString {
            appendLine(
                """
                    You are an expert in analysing Business Process Model and Notation (BPMN) diagrams for GDPR compliance. Your task is to identify and return a list of the IDs of all Activity (Task) elements that process personal data. Ignore all other element types. Always consider every activity in the process; do not omit any activity from your assessment.

                    Use all available context for each activity – including the activity’s name, description, annotations, associated data objects, and message or data associations – to determine whether the activity processes personal data. Under Article 4 of the GDPR, personal data is any information relating to an identified or identifiable natural person, including names, addresses, email addresses, phone numbers, identification numbers, payment or bank details, employment records, academic records, location data, IP addresses, online identifiers, images, audio/video recordings, biometric identifiers, health data or other information that can be linked to a specific person. “Processing” includes any operation performed on personal data, such as collecting, recording, organising, structuring, storing, retrieving, consulting, using, analysing, transmitting, printing, disseminating, aligning, combining, altering, restricting, erasing or destroying the data.

                    Classify an activity as GDPR‑relevant whenever it performs or enables processing of personal data. Indicators include (but are not limited to):

                    • **Collection and entry of personal data**: Activities that collect or capture personal information, for example entering contact details, addresses, payment information, job applications, health information, student enrolments, membership data, tax declarations, registration forms or other forms with personally identifiable information.
                    • **Creation, storage and updating of records**: Activities that create, save or update records containing personal data, such as opening customer accounts, storing order or appointment details, creating personnel files, enrolling students, setting up insurance cases or filing a medical record.
                    • **Transmission or disclosure of personal data**: Activities that send, print or otherwise disclose personal data to another participant, system or third party. Examples include printing shipping labels or prescriptions, sending orders or personal data to logistics partners, pharmacies, insurers or authorities, generating payroll reports for external providers, notifying universities about student records, transmitting tax or social security data, sending confirmations or queries that rely on a person’s contact details, or transferring data to non‑EU locations.
                    • **Payments and financial transactions**: Activities that process personal financial data, such as initiating or verifying payments, processing bank account or credit‑card information, executing payroll, handling reimbursements or insurance payouts, managing expense claims or collecting membership fees.
                    • **Use of health, biometric or other special categories of data**: Activities that handle medical diagnoses, prescriptions, insurance claims, disability information, photos of damages or patients, biometric identifiers (fingerprints, facial images, voice), racial or ethnic data, political opinions, religious beliefs or union membership. Processing these “special categories” always triggers GDPR relevance.
                    • **Audio/Video and communications**: Activities that initiate or join audio or video calls, record calls or meetings, capture surveillance footage, or communicate directly with a data subject via email, chat, SMS or other channels. Simply using a person’s contact data to send reminders, marketing messages or notifications is processing.
                    • **Profiling, scoring and decision‑making**: Activities that analyse or evaluate a person’s performance, behaviour or characteristics for purposes such as credit scoring, hiring, admissions, insurance underwriting, marketing segmentation, customer value analysis or automated decision‑making.
                    • **Logging, tracking and location data**: Activities that log user activity, record access or usage data, track geolocation (e.g. telematics, fleet or mobile tracking), monitor attendance or timekeeping, or collect IP addresses or device identifiers.
                    • **Consent and data‑subject rights**: Activities that obtain, record or manage consent; respond to requests for access, rectification, restriction, erasure, data portability or objections; or document lawful bases for processing.
                    • **Deletion, anonymisation or pseudonymisation**: Activities that erase, anonymise or pseudonymise personal data, even if the goal is to remove identifiers, because these operations manipulate personal data.

                    When assessing an activity, consider synonyms or domain‑specific terms: activities referring to customers, patients, applicants, employees, students, voters, taxpayers, residents or members often imply personal data processing, even if names like “address” or “contact” are absent. Use context – data objects, annotations or typical process semantics – to infer personal data involvement. Do not rely solely on explicit data‑object links; many process names (“Anmeldung prüfen”, “Aufnahmeantrag bearbeiten”, “Kundeninfo aktualisieren”, “Registrierung bestätigen”, “Kreditwürdigkeit berechnen”) themselves indicate personal data processing.

                    Do **not** classify an activity as GDPR‑relevant when it only performs administrative or logistic tasks that do not involve personal data. Examples include picking or packing goods, routing vehicles without using specific addresses, printing generic pick lists, moving items in inventory, or checking if a document exists without viewing its contents. Likewise, activities using truly aggregated or irreversibly anonymised data can be ignored if no individual can be reidentified.

                    In your output, return only the IDs of activities you classify as GDPR‑relevant. For each, provide a clear explanation in englisch using the activity’s name and description to justify why it processes personal data. Do not reference element IDs in your explanation; use the activity names instead. Exclude from your result any activities that do not process personal data and any elements that are not activity/task elements.
                """.trimIndent()
            )
        })
    }
}
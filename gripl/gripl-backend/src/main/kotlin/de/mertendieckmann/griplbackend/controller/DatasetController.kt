package de.mertendieckmann.griplbackend.controller

import BpmnConverter
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/dataset")
class DatasetController(
    private val evaluationDataRepository: EvaluationDataRepository
) {
    private val log = KotlinLogging.logger { }

    @GetMapping("/{id}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getBpmnDataset(@PathVariable("id") id: Long): EvaluationData {
        val datasetEntry = evaluationDataRepository.getEvaluationDataById(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No dataset entry found for Id: $id")

        return datasetEntry
    }

    @GetMapping("/{id}/preview", produces = [MediaType.TEXT_XML_VALUE])
    fun getSvg(@PathVariable id: Long): ResponseEntity<String> {
        val bpmnConverter = BpmnConverter()

        val datasetEntry = evaluationDataRepository.getEvaluationDataById(id)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kein Datensatz gefunden für Id: $id")
        val bpmnXml = datasetEntry.bpmnXml

        val svg = try {
            bpmnConverter.convertXmlToSvg(bpmnXml)
        } catch (ex: IllegalArgumentException) {
            log.error(ex) { "Ungültiges BPMN XML für Id: $id" }
            return ResponseEntity.badRequest().body("Fehler beim Parsen: ${ex.message}")
        } catch (ex: Exception) {
            return ResponseEntity.status(500).body("Serverfehler: ${ex.message}")
        }

        return ResponseEntity.ok(svg)
    }
}
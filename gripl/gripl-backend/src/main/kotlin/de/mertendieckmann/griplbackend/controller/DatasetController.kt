package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.application.PreviewGenerator
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.model.dto.EvaluationDataMeta
import de.mertendieckmann.griplbackend.model.dto.EvaluationDataWithOptionalId
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/dataset")
class DatasetController(
    private val evaluationDataRepository: EvaluationDataRepository
) {
    private val log = KotlinLogging.logger { }

    @GetMapping("", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getAllBpmnDatasetMeta(): List<EvaluationDataMeta> {
        val datasets = evaluationDataRepository.getAllEvaluationData()
        if (datasets.isEmpty()) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "No datasets found")
        }
        return datasets.map { EvaluationDataMeta(it.id, it.name) }
    }

    @GetMapping("/{id}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getBpmnDataset(@PathVariable("id") id: Long): EvaluationData {
        val datasetEntry = evaluationDataRepository.getEvaluationDataById(id)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "No dataset entry found for Id: $id")

        return datasetEntry
    }

    @PostMapping("/{id}")
    fun updateBpmnDataset(@RequestBody evaluationData: EvaluationData): ResponseEntity<String> {
        val existingEntry = evaluationDataRepository.getEvaluationDataById(evaluationData.id)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No dataset entry found for Id: ${evaluationData.id}")

        log.info { "Updating existing dataset entry with Id: ${evaluationData.id}" }

        val affectedRows = evaluationDataRepository.updateEvaluationData(EvaluationData(
            id = existingEntry.id,
            name = evaluationData.name,
            bpmnXml = evaluationData.bpmnXml,
            expectedValues = evaluationData.expectedValues
        ))
        return if (affectedRows > 0) {
            ResponseEntity.ok("Dataset entry updated successfully")
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update dataset entry")
        }
    }

    @PostMapping("")
    fun insertBpmnDataset(@RequestBody evaluationData: EvaluationDataWithOptionalId): ResponseEntity<Int> {
        val idOfCreatedEntry = evaluationDataRepository.insertEvaluationData(evaluationData)
        return if (idOfCreatedEntry != null) {
            ResponseEntity.status(HttpStatus.CREATED).body(idOfCreatedEntry)
        } else {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1)
        }
    }

    @GetMapping("/{id}/preview", produces = ["image/svg+xml"])
    fun getSvg(
        @PathVariable id: Long,
        @RequestParam correctIds: List<String> = emptyList(),
        @RequestParam falsePositiveIds: List<String> = emptyList(),
        @RequestParam falseNegativeIds: List<String> = emptyList()
    ): ResponseEntity<String> {
        val previewGenerator = PreviewGenerator()

        val datasetEntry = evaluationDataRepository.getEvaluationDataById(id)
            ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kein Datensatz gefunden für Id: $id")
        val bpmnXml = datasetEntry.bpmnXml

        val svg = try {
            previewGenerator.convertXmlToSvg(bpmnXml, correctIds = correctIds, falsePositiveIds = falsePositiveIds, falseNegativeIds = falseNegativeIds)
        } catch (ex: IllegalArgumentException) {
            log.error(ex) { "Ungültiges BPMN XML für Id: $id" }
            return ResponseEntity.badRequest().body("Fehler beim Parsen: ${ex.message}")
        } catch (ex: Exception) {
            log.error(ex) { "Fehler beim Generieren des SVG für Id: $id" }
            return ResponseEntity.status(500).body("Serverfehler: ${ex.message}")
        }

        return ResponseEntity.ok()
            .header("Content-Type", "image/svg+xml")
            .body(svg)
    }
}
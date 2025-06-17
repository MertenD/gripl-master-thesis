package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.application.PreviewGenerator
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
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
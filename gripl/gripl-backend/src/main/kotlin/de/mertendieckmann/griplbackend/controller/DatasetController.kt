package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import org.camunda.bpm.model.bpmn.Bpmn
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
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

    @GetMapping("/{id}", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getBpmnDataset(@PathVariable("id") id: Long): EvaluationData {
        val datasetEntry = evaluationDataRepository.getEvaluationDataById(id)

        if (datasetEntry == null) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "No dataset entry found for Id: $id")
        }

        return datasetEntry
    }
}
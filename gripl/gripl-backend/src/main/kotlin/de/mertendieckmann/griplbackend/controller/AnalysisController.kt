package de.mertendieckmann.griplbackend.controller

import de.mertendieckmann.griplbackend.dto.AnalysisRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/gdpr")
class AnalysisController {

    @PostMapping("/analysis")
    fun analyzeBpmnForGdpr(@RequestBody request: AnalysisRequest): ResponseEntity<List<String>> {

        val gdprCriticalElementIds = listOf("id1", "id2", "id3")

        return ResponseEntity(gdprCriticalElementIds, HttpStatus.OK)
    }
}
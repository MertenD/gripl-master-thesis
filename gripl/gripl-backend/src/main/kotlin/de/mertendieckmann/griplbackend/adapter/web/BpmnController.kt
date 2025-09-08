package de.mertendieckmann.griplbackend.adapter.web

import de.mertendieckmann.griplbackend.application.BpmnExtractor
import de.mertendieckmann.griplbackend.model.BpmnElement
import io.swagger.v3.oas.annotations.Operation
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.http.codec.multipart.FilePart
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

@RestController
@RequestMapping("/bpmn")
class BpmnController() {

    @Operation(
        summary = "Extract BPMN elements from BPMN-XML",
        description = "Upload a BPMN XML document (file part **bpmnFile**). The service extracts all BPMN elements from the XML and returns them as JSON."
    )
    @PostMapping(
        "/extract",
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE],
        produces = [MediaType.APPLICATION_JSON_VALUE]
    )
    fun extractBpmnElements(
        @RequestPart("bpmnFile") file: FilePart,
    ): Mono<ResponseEntity<Set<BpmnElement>>> {

        val bpmnXmlMono: Mono<String> = DataBufferUtils
            .join(file.content())
            .map { dataBuffer ->
                dataBuffer.asInputStream().bufferedReader().use { it.readText() }
            }

        return bpmnXmlMono.flatMap { bpmnXml ->
            Mono.fromCallable {
                val extractor = BpmnExtractor()
                extractor.extractBpmnElements(bpmnXml)
            }.subscribeOn(Schedulers.boundedElastic())
        }.map { ResponseEntity.ok(it) }
    }
}
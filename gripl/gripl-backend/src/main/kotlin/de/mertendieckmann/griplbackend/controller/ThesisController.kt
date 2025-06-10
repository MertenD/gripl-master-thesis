package de.mertendieckmann.griplbackend.controller

import org.springframework.core.io.ByteArrayResource
import org.springframework.http.CacheControl
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/thesis")
class ThesisController {

    private val thesisUrl = "https://raw.githubusercontent.com/MertenD/gripl-master-thesis/gh-pages/main.pdf"
    private val restTemplate = RestTemplate()

    @GetMapping("/pdf")
    fun getThesisPdf(): ResponseEntity<ByteArrayResource> {
        val response = restTemplate.getForEntity(thesisUrl, ByteArray::class.java)

        if (!response.statusCode.is2xxSuccessful || response.body == null) {
            return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ByteArrayResource("Failed to fetch thesis PDF".toByteArray()))
        }

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_PDF
            contentDisposition = ContentDisposition.inline().filename("main.pdf").build()
            cacheControl = CacheControl.maxAge(30, TimeUnit.SECONDS).cachePublic().headerValue
        }

        val resource = ByteArrayResource(response.body!!)
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(resource)
    }
}
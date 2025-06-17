package de.mertendieckmann.griplbackend.application.preview

import com.microsoft.playwright.Playwright
import io.github.oshai.kotlinlogging.KotlinLogging
import java.nio.file.Files
import java.nio.file.Paths

class PreviewGenerator {

    private val log = KotlinLogging.logger { }
    private val htmlTemplate: String = loadHtmlTemplate()

    private fun loadHtmlTemplate(): String {
        val path = Paths.get("src/main/kotlin/de/mertendieckmann/griplbackend/application/preview/PreviewGeneratorTemplate.html")
        return Files.readString(path)
    }

    fun convertXmlToSvg(bpmnXml: String, correctIds: List<String>, falsePositiveIds: List<String>, falseNegativeIds: List<String>): String {
        Playwright.create().use { pw ->
            val browser = pw.chromium().launch(
                com.microsoft.playwright.BrowserType.LaunchOptions()
                    .setHeadless(true)
                    .setArgs(listOf(
                        "--no-sandbox",
                        "--disable-setuid-sandbox"
                    ))
            )
            browser.newPage().use { page ->
                page.setContent(htmlTemplate)
                page.waitForFunction("() => typeof window.convertBpmn === 'function'")

                val correctIdsString = correctIds.joinToString(",", "[", "]") { "\"$it\"" }
                val falsePositiveIdsString = falsePositiveIds.joinToString(",", "[", "]") { "\"$it\"" }
                val falseNegativeIdsString = falseNegativeIds.joinToString(",", "[", "]") { "\"$it\"" }

                val result = page.evaluate("""xml => window.convertBpmn(xml, $correctIdsString, $falsePositiveIdsString, $falseNegativeIdsString)""", bpmnXml)

                val success = (result as Map<*, *>)["success"] as Boolean
                if (!success) {
                    val err = result["error"] ?: "Unbekannter Fehler"
                    throw IllegalArgumentException("Ungültiges BPMN XML: $err")
                }
                return (result["svg"] as String)
            }
        }
    }
}
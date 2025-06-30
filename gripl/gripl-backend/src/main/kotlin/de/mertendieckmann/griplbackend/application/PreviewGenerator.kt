package de.mertendieckmann.griplbackend.application

import com.microsoft.playwright.Playwright

class PreviewGenerator {

    private val htmlTemplate: String = loadHtmlTemplate()

    private fun loadHtmlTemplate(): String {
        return javaClass.getResource("/PreviewGeneratorTemplate.html")
            ?.readText(Charsets.UTF_8)
            ?: error("PreviewGeneratorTemplate.html nicht gefunden")
    }

    fun convertXmlToSvg(bpmnXml: String, correctIds: List<String>, falsePositiveIds: List<String>, falseNegativeIds: List<String>, theme: String = "light"): String {
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

                val result = page.evaluate("""xml => window.convertBpmn(xml, $correctIdsString, $falsePositiveIdsString, $falseNegativeIdsString, "$theme")""", bpmnXml)

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
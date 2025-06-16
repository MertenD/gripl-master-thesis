import com.microsoft.playwright.Playwright

class BpmnConverter {

    private val htmlTemplate = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8"/>
          <script src="https://unpkg.com/bpmn-js@17.0.2/dist/bpmn-viewer.development.js"></script>
          <style>
            #canvas { width: 100%; height: 500px; }
          </style>
        </head>
        <body>
          <div id="canvas"></div>
          <script>
            window.convertBpmn = async function(xml) {
              try {
                const viewer = new BpmnJS({ container: '#canvas' });
                await viewer.importXML(xml);
                const { svg } = await viewer.saveSVG();
                return { success: true, svg };
              } catch (e) {
                return { success: false, error: e.message };
              }
            }
          </script>
        </body>
        </html>
    """.trimIndent()

    fun convertXmlToSvg(bpmnXml: String): String {
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

                val result = page.evaluate("""xml => window.convertBpmn(xml)""", bpmnXml)
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
import { type NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function GET(request: NextRequest) {
    let browser = null

    try {
        const urlParts = request.nextUrl.pathname.split("/")
        const id = urlParts[urlParts.length - 1]

        const response = await fetch(`http://localhost:3000/api/dataset/${id}`);
        console.log("Fetching dataset with ID:", id, "Result status:", response.status);

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json({ error: "Datensatz nicht gefunden" }, { status: 404 });
            }
            return NextResponse.json({ error: "Fehler beim Abrufen des Datensatzes" }, { status: 400 });
        }

        const data = await response.json();
        const bpmnXml = data.bpmnXml;

        if (!bpmnXml) {
            return NextResponse.json({ error: "BPMN XML ist erforderlich" }, { status: 400 });
        }

        if (!bpmnXml) {
            return NextResponse.json({ error: "BPMN XML ist erforderlich" }, { status: 400 })
        }

        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--disable-gpu",
            ],
        })

        const page = await browser.newPage()

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://unpkg.com/bpmn-js@17.0.2/dist/bpmn-viewer.development.js"></script>
                <style>
                    #canvas { width: 100%; height: 500px; }
                </style>
            </head>
            <body>
                <div id="canvas"></div>
                <script>
                    window.convertBpmn = async function(bpmnXml) {
                        try {
                            const viewer = new BpmnJS({
                                container: '#canvas'
                            });
                            
                            await viewer.importXML(bpmnXml);
                            const result = await viewer.saveSVG();
                            
                           
                            
                            return { success: true, svg: result.svg };
                        } catch (error) {
                            return { success: false, error: error.message };
                        }
                    };
                </script>
            </body>
            </html>
    `

        await page.setContent(html)
        // @ts-ignore
        await page.waitForFunction(() => typeof window.BpmnJS !== "undefined")

        const result = await page.evaluate(async (xml) => {
            // @ts-ignore
            return await window.convertBpmn(xml)
        }, bpmnXml)

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Ungültiges BPMN XML. Bitte überprüfen Sie die Syntax.",
                    details: result.error,
                },
                { status: 400 },
            )
        }

        return new NextResponse(result.svg, {
            headers: {
                "Content-Type": "image/svg+xml",
            },
        });
    } catch (error) {
        console.error("API Error:", error)

        return NextResponse.json(
            {
                error: "Serverfehler beim Konvertieren des BPMN",
                details: error instanceof Error ? error.message : "Unbekannter Fehler",
            },
            { status: 500 },
        )
    } finally {
        if (browser) {
            await browser.close()
        }
    }
}

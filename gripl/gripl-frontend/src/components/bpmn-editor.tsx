"use client"

import { useEffect, useRef, useState } from "react"
import { Download, ZoomIn, ZoomOut, RotateCcw, RotateCw } from "lucide-react"
import {Button} from "@/components/ui/button";

interface BpmnEditorProps {
  bpmnXml: string
  highlightedActivityIds?: string[]
  onSave?: (xml: string) => void
}

export default function BpmnEditor({ bpmnXml, highlightedActivityIds = [], onSave }: BpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const styleElementRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || !bpmnXml) return

    const initializeModeler = async () => {
      try {
        // @ts-ignore
        const BpmnModeler = (await import("bpmn-js/dist/bpmn-modeler.production.min.js")).default

        if (modelerRef.current) {
          try {
            modelerRef.current.destroy()
          } catch (err) {
            console.error("Fehler beim Zerstören des vorherigen Modelers", err)
          }
          modelerRef.current = null
        }

        const modeler = new BpmnModeler({
          container: containerRef.current
        })

        modelerRef.current = modeler

        modeler.on("commandStack.changed", () => {
          try {
            const commandStack = modeler.get("commandStack")
            setCanUndo(commandStack.canUndo())
            setCanRedo(commandStack.canRedo())

            if (onSave) {
              modeler
                  .saveXML({ format: true })
                  .then(({ xml }: { xml: string }) => {
                    onSave(xml)
                  })
                  .catch((err: any) => {
                    console.error("Fehler beim automatischen Speichern", err)
                  })
            }
          } catch (err) {
            console.error("Fehler beim Verarbeiten von Änderungen", err)
          }
        })

        try {
          await modeler.importXML(bpmnXml)

          try {
            modeler.get("canvas").zoom("fit-viewport")
          } catch (err) {
            console.error("Fehler beim Zoomen", err)
          }

          setIsLoaded(true)

          try {
            const commandStack = modeler.get("commandStack")
            setCanUndo(commandStack.canUndo())
            setCanRedo(commandStack.canRedo())
          } catch (err) {
            console.error("Fehler beim Aktualisieren des Undo/Redo-Status", err)
          }

          if (highlightedActivityIds) {
            highlightActivities(modeler, highlightedActivityIds)
          }
        } catch (err) {
          console.error("Fehler beim Importieren des BPMN-Diagramms", err)
          setIsLoaded(false)
        }
      } catch (err) {
        console.error("Fehler beim Initialisieren des BPMN-Modelers", err)
      }
    }

    initializeModeler().then()

    return () => {
      if (modelerRef.current) {
        try {
          modelerRef.current.destroy()
        } catch (err) {
          console.error("Fehler beim Zerstören des Modelers", err)
        }
        modelerRef.current = null
        setIsLoaded(false)
      }

      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current)
        styleElementRef.current = null
      }
    }
  }, [bpmnXml, onSave])

  useEffect(() => {
    if (!modelerRef.current || !isLoaded || !highlightedActivityIds) return
    highlightActivities(modelerRef.current, highlightedActivityIds)
  }, [highlightedActivityIds, isLoaded])

  const highlightActivities = (modeler: any, activityIds: string[]) => {
    try {
      const canvas = modeler.get("canvas")
      const elementRegistry = modeler.get("elementRegistry")

      elementRegistry.getAll().forEach((element: any) => {
        if (element.id) {
          canvas.removeMarker(element.id, "highlight-privacy")
        }
      })

      if (activityIds.length === 0) {
        return
      }

      activityIds.forEach((id) => {
        const element = elementRegistry.get(id)
        if (element) {
          canvas.addMarker(id, "highlight-privacy")
        }
      })

      if (!styleElementRef.current) {
        const styleElement = document.createElement("style")
        styleElement.textContent = `
          .highlight-privacy .djs-visual > :nth-child(1) {
            fill: rgba(255, 0, 0, 0.2) !important;
          }
        `
        document.head.appendChild(styleElement)
        styleElementRef.current = styleElement
      }
    } catch (err) {
      console.error("Fehler beim Hervorheben der Aktivitäten", err)
    }
  }

  const handleZoomIn = () => {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("zoomScroll").stepZoom(1)
    } catch (err) {
      console.error("Fehler beim Zoomen", err)
    }
  }

  const handleZoomOut = () => {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("zoomScroll").stepZoom(-1)
    } catch (err) {
      console.error("Fehler beim Zoomen", err)
    }
  }

  const handleZoomReset = () => {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("canvas").zoom("fit-viewport")
    } catch (err) {
      console.error("Fehler beim Zurücksetzen des Zooms", err)
    }
  }

  const handleUndo = () => {
    if (!modelerRef.current || !isLoaded || !canUndo) return

    try {
      modelerRef.current.get("commandStack").undo()
    } catch (err) {
      console.error("Fehler beim Rückgängig machen", err)
    }
  }

  const handleRedo = () => {
    if (!modelerRef.current || !isLoaded || !canRedo) return

    try {
      modelerRef.current.get("commandStack").redo()
    } catch (err) {
      console.error("Fehler beim Wiederherstellen", err)
    }
  }

  const handleExport = async () => {
    if (!modelerRef.current || !isLoaded) return

    try {
      const { xml } = await modelerRef.current.saveXML({ format: true })
      const blob = new Blob([xml], { type: "application/xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "diagram.bpmn"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Fehler beim Exportieren des BPMN-Diagramms", err)
    }
  }

  return (
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-wrap items-center justify-between p-2 bg-card border-b gap-2">
          <div className="flex items-center space-x-1">
            <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                title="Vergrößern"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                title="Verkleinern"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleZoomReset}
                title="Ansicht zurücksetzen"
            >
              <span className="text-xs">100%</span>
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Rückgängig"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Wiederherstellen"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-1">
            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                title="Exportieren"
            >
              <Download className="h-4 w-4 mr-1" />
              Exportieren
            </Button>
          </div>
        </div>
        <div ref={containerRef} className="w-full flex-1" />
      </div>
  )
}


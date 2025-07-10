"use client"

import React, {useEffect, useRef, useState} from "react"
import {Download, PlusCircle, RotateCcw, RotateCw, ZoomIn, ZoomOut} from "lucide-react"
import {Button} from "@/components/ui/button";
import BpmnUploadButton from "@/components/bpmn-upload-button";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import emptyDiagram from "@/data/empty-diagram.bpmn";
// @ts-ignore
import DisableModelingModule from 'bpmn-js-token-simulation/lib/features/disable-modeling';
// @ts-ignore
import { TOGGLE_MODE_EVENT } from 'bpmn-js-token-simulation/lib/util/EventHelper';
import {BpmnEditorEvent} from "@/models/BpmnEditorEvent";

interface BpmnEditorProps {
  title?: string
  bpmnXml: string
  highlightedActivityIds?: string[]
  onNew?: () => void
  onDiagramChanged: (xml: string) => void
  cards?: BpmnToolCard[]
  onElementClicked?: (element: any) => void
  editorClassName?: string
  disableEditing?: boolean
  onEvent?: (type: BpmnEditorEvent, event: any) => void
  onModelerChanged?: (modeler: any) => void
}

export default function BpmnEditor({ title, bpmnXml, highlightedActivityIds = [], onNew, onDiagramChanged, cards = [],
                                     onElementClicked, editorClassName, disableEditing, onEvent, onModelerChanged }: BpmnEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const styleElementRef = useRef<HTMLStyleElement | null>(null)
  const disableEditingRef = useRef(disableEditing)

  useEffect(() => {
    if (onModelerChanged && modelerRef.current) {
      onModelerChanged(modelerRef.current)
    }
  }, [modelerRef.current])

  useEffect(() => {
    if (!containerRef.current || !bpmnXml) return

    initializeModeler(bpmnXml).then()

    return () => {
      if (modelerRef.current) {
        try {
          modelerRef.current.destroy()
        } catch (err) {
          console.error("Fehler bei m Zerstören des Modelers", err)
        }
        modelerRef.current = null
        setIsLoaded(false)
      }

      if (styleElementRef.current) {
        document.head.removeChild(styleElementRef.current)
        styleElementRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !modelerRef.current || !bpmnXml) return

    disableEditingRef.current = disableEditing

    if (disableEditing) {
      const selection = modelerRef.current.get("selection")
      selection.select([]);
    }

    modelerRef.current
        .get('eventBus')
        .fire(TOGGLE_MODE_EVENT, { active: disableEditing })

    document
        .querySelector('.djs-palette')
        ?.toggleAttribute('hidden', disableEditing);
  }, [disableEditing])

  useEffect(() => {
    if (!modelerRef.current || !isLoaded || !highlightedActivityIds) return
    highlightActivities(modelerRef.current, highlightedActivityIds)
  }, [highlightedActivityIds, isLoaded])

  async function handleFileLoaded(content: string) {
    onDiagramChanged(content)
    initializeModeler(content).then()
  }

  async function initializeModeler(xml: string) {
    try {
      const BpmnModeler = // @ts-ignore
          (await import("bpmn-js/dist/bpmn-modeler.production.min.js")).default


      if (modelerRef.current) {
        try {
          modelerRef.current.destroy()
        } catch (err) {
          console.error("Fehler beim Zerstören des vorherigen Modelers", err)
        }
        modelerRef.current = null
      }

      const modeler = new BpmnModeler({
        container: containerRef.current,
        additionalModules: [ DisableModelingModule ]
      })

      modelerRef.current = modeler

      const eventBus = modeler.get("eventBus")

      Object.values(BpmnEditorEvent).forEach(function(event) {
        eventBus.on(event, function(e: any) {
          if (onEvent) {
            onEvent(event as BpmnEditorEvent, e)
          }
        });
      });

      eventBus.on("element.click", (e: any) => {
        const element = e.element
        if (!element || element.labelTarget) return
        onElementClicked?.(element)
        if (disableEditingRef.current) {
          const selection = modeler.get("selection")
          selection.select([]);
        }
      })

      modeler.on("commandStack.changed", () => {
        try {
          const commandStack = modeler.get("commandStack")
          setCanUndo(commandStack.canUndo())
          setCanRedo(commandStack.canRedo())

          if (onDiagramChanged) {
            modeler
                .saveXML({ format: true })
                .then(({ xml }: { xml: string }) => {
                  onDiagramChanged(xml)
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
        await modeler.importXML(xml)

        const canvas = modeler.get("canvas");
        canvas.zoom("fit-viewport");
        modelerRef.current.get("zoomScroll").stepZoom(-1)

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

  function highlightActivities(modeler: any, activityIds: string[]) {
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
            fill: hsl(var(--destructive) / 50%) !important;
          }
        `
        document.head.appendChild(styleElement)
        styleElementRef.current = styleElement
      }
    } catch (err) {
      console.error("Fehler beim Hervorheben der Aktivitäten", err)
    }
  }

  function handleZoomIn() {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("zoomScroll").stepZoom(1)
    } catch (err) {
      console.error("Fehler beim Zoomen", err)
    }
  }

  function handleZoomOut() {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("zoomScroll").stepZoom(-1)
    } catch (err) {
      console.error("Fehler beim Zoomen", err)
    }
  }

  function handleZoomReset() {
    if (!modelerRef.current || !isLoaded) return

    try {
      modelerRef.current.get("canvas").zoom("fit-viewport")
    } catch (err) {
      console.error("Fehler beim Zurücksetzen des Zooms", err)
    }
  }

  function handleUndo() {
    if (!modelerRef.current || !isLoaded || !canUndo) return

    try {
      modelerRef.current.get("commandStack").undo()
    } catch (err) {
      console.error("Fehler beim Rückgängig machen", err)
    }
  }

  function handleRedo() {
    if (!modelerRef.current || !isLoaded || !canRedo) return

    try {
      modelerRef.current.get("commandStack").redo()
    } catch (err) {
      console.error("Fehler beim Wiederherstellen", err)
    }
  }

  async function handleExport() {
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
            {title && <h2 className="text-lg font-semibold mr-4 ml-2">{title}</h2>}
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
              onClick={() => {
                if (onNew) onNew()
                handleFileLoaded(emptyDiagram).then()
              }}
              title="Neues Diagramm erstellen"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Neu erstellen
            </Button>
            <BpmnUploadButton onFileLoaded={handleFileLoaded} />
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
        <div ref={containerRef} className={`w-full flex-1 relative ${editorClassName}`}>
          { cards && cards.map((card: BpmnToolCard, index: number) => (
            <div
              key={`bpmn-editor-card-${index}`}
              className={`absolute z-10
                ${card.position === "bottom-left" ? "left-4 bottom-4" : ""}
                ${card.position === "bottom-right" ? "right-4 bottom-14" : ""}
                ${card.position === "top-right" ? "right-4 top-4" : ""}
                ${card.position === "right-center" ? "right-4 top-1/2 transform -translate-y-1/2" : ""}
                ${card.position === "bottom-center" ? "left-1/2 transform -translate-x-1/2 bottom-4" : ""}
                ${card.position === "top-center" ? "left-1/2 transform -translate-x-1/2 top-4" : ""}
              `}
            >
              {card.content}
            </div>
          ))}
        </div>
      </div>
  )
}


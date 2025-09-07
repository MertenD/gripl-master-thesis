"use client"

import BpmnEditor from "@/components/bpmn-editor";
import {useState} from "react";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import AnalysisToolCard from "@/components/sandbox/analysis-tool-card";
import emptyDiagram from "@/data/empty-diagram.bpmn";
import {AnalysisResponse} from "@/models/dto/AnalysisDto";
import AnalysisResultCard from "@/components/sandbox/analysis-result-card";
import {BpmnEditorEvent} from "@/models/BpmnEditorEvent";

export default function Home() {
  const [diagram, setDiagram] = useState<string>(emptyDiagram as string)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  function handleCreateNewDiagram() {
    setAnalysisResult(null)
  }

  function onEvent(type: BpmnEditorEvent, event: any) {
    if (type === BpmnEditorEvent.SelectionChanged) {
      setSelectedElementId(event.newSelection?.length === 1 ? event.newSelection[0].id : null)
    }
  }

  const editorToolCards: BpmnToolCard[] = [
    {
      position: "top-right",
      content: <AnalysisToolCard
          bpmnXml={diagram}
          analysisResult={analysisResult}
          setAnalysisResult={setAnalysisResult}
      />
    } as BpmnToolCard,
    {
      position: "bottom-center",
      content: <AnalysisResultCard analysisResult={analysisResult} selectedElementId={selectedElementId} />
    }
  ]

  return <main className="flex flex-col justify-center items-center h-full w-full">
    <div className="w-full h-full">
      <BpmnEditor
          bpmnXml={diagram}
          highlightedActivityIds={analysisResult?.criticalElements?.map(e => e.id) || []}
          onNew={handleCreateNewDiagram}
          onDiagramChanged={setDiagram}
          cards={editorToolCards}
          onEvent={onEvent}
      />
    </div>
  </main>
}
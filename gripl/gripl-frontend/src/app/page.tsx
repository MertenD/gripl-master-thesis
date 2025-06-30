"use client"

import BpmnEditor from "@/components/bpmn-editor";
import {useState} from "react";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import AnalysisToolCard from "@/components/analysis-tool-card";
import emptyDiagram from "@/data/empty-diagram.bpmn";

export default function Home() {
  const [diagram, setDiagram] = useState<string>(emptyDiagram as string)
  const [highlightedActivityIds, setHighlightedActivityIds] = useState<string[]>([])

  function handleCreateNewDiagram() {
    setHighlightedActivityIds([])
  }

  const editorToolCards: BpmnToolCard[] = [
    {
      position: "top-right",
      content: <AnalysisToolCard
          bpmnXml={diagram}
          highlightedActivityIds={highlightedActivityIds}
          setHighlightedActivityIds={setHighlightedActivityIds}
      />
    } as BpmnToolCard
  ]

  return <main className="flex flex-col justify-center items-center h-full w-full">
    <div className="w-full h-full">
      <BpmnEditor
          bpmnXml={diagram}
          highlightedActivityIds={highlightedActivityIds}
          onNew={handleCreateNewDiagram}
          onDiagramChanged={setDiagram}
          cards={editorToolCards}
      />
    </div>
  </main>
}
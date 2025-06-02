"use client"

import BpmnEditor from "@/components/bpmn-editor";
import {useState} from "react";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import AnalysisToolCard from "@/components/analysis-tool-card";

export default function Home() {
  const [diagram, setDiagram] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
    <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                      xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                      id="Definitions_1" 
                      targetNamespace="http://bpmn.io/schema/bpmn">
      <bpmn:process id="Process_1" isExecutable="false">
        <bpmn:startEvent id="StartEvent_1" />
      </bpmn:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds x="173" y="102" width="36" height="36" />
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn:definitions>`)

  const editorToolCards: BpmnToolCard[] = [
    {
      position: "top-right",
      content: <AnalysisToolCard bpmnXml={diagram} />
    } as BpmnToolCard
  ]

  return <main className="flex flex-col justify-center items-center h-full w-full">
    <div className="w-full h-full">
      <BpmnEditor title="GRIPL" bpmnXml={diagram} onSave={setDiagram} cards={editorToolCards} />
    </div>
  </main>
}

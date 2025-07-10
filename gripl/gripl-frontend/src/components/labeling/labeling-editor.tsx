"use client"

import BpmnEditor from "@/components/bpmn-editor";
import {EvaluationData} from "@/models/dto/EvaluationData";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";
import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {BpmnEditorEvent} from "@/models/BpmnEditorEvent";
import {Textarea} from "@/components/ui/textarea";

interface LabelingEditorProps {
    className?: string;
    evaluationData: EvaluationData;
}

export default function LabelingEditor({ className, evaluationData }: LabelingEditorProps) {
    const [diagram, setDiagram] = useState<string>(evaluationData.bpmnXml)
    const [isLabelMode, setIsLabelMode] = useState<boolean>(false);
    const [highlightedActivityIds, setHighlightedActivityIds] = useState<string[]>(
        evaluationData.expectedValues.map(exp => exp.value)
    );
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [selectedElement, setSelectedElement] = useState<any | null>(null);

    function onSave() {
        const requestBody = {
            id: evaluationData?.id || undefined,
            bpmnXml: diagram,
            name: evaluationData?.name || "",
            expectedValues: highlightedActivityIds
                .filter(id => diagram.includes(id))
                .map(id => { return { value: id } })
        }

        fetch(`/api/dataset/${evaluationData.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }).then(response => {
            if (!response.ok) {
                console.error("Error while saving test case:", response.statusText);
                throw new Error("Fehler beim Speichern des Testfalls");
            }
            setHasUnsavedChanges(false)
            alert("Test case saved sccessfully!");
        }).catch(error => {
            console.error("Error while saving test case:", error);
            alert("Error while saving test case: " + error.message);
        });
    }

    function handleDiagramChanged(xml: string) {
        setDiagram(xml)
        setHasUnsavedChanges(true)
    }

    function handleElementLabelingChange(elementId: string, isChecked: boolean) {
        if (isChecked) {
            if (!highlightedActivityIds.includes(elementId)) {
                setHighlightedActivityIds([...highlightedActivityIds, elementId])
            }
        } else {
            setHighlightedActivityIds(highlightedActivityIds.filter(id => id !== elementId))
        }
        setHasUnsavedChanges(true)
    }

    function handleEditorEvent(type: BpmnEditorEvent, event: any) {
        if (type === BpmnEditorEvent.SelectionChanged) {
            setSelectedElement(event.newSelection.length === 1 ? event.newSelection[0] : null);
        }
    }

    const cards: BpmnToolCard[] = [
        {
            position: "top-right",
            content: <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">Labeltools</h2>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Button
                        onClick={onSave}
                        variant="default"
                        disabled={!hasUnsavedChanges}
                    >
                        <Save className="mr-2 h-4 w-4"/>
                        Save Test Case
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Switch id="label-mode" onCheckedChange={setIsLabelMode}/>
                        <Label htmlFor="label-mode">Label Mode</Label>
                    </div>
                </CardContent>
            </Card>
        },
        {
            position: "top-right",
            content: selectedElement && isLabelMode && <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">{selectedElement.businessObject.name}</h2>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="label-mode"
                            defaultChecked={highlightedActivityIds.includes(selectedElement.id)}
                            onCheckedChange={(checked) => handleElementLabelingChange(selectedElement.id, checked)}
                        />
                        <Label htmlFor="label-mode">Is GDPR critical</Label>
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                        <Label htmlFor="reason">Reason for labeling</Label>
                        <Textarea
                            id="reason"
                            className="p-2 border rounded"
                            placeholder="Enter reason for labeling this activity..."
                            rows={5}
                            onChange={(event) => {
                              // TODO
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        }
    ]

    return (
        <div className={`h-full ${className}`}>
            <BpmnEditor
                title={evaluationData.name || ""}
                bpmnXml={diagram}
                cards={cards}
                highlightedActivityIds={highlightedActivityIds}
                onDiagramChanged={handleDiagramChanged}
                editorClassName={isLabelMode ? "border border-destructive" : ""}
                disableEditing={isLabelMode}
                onEvent={handleEditorEvent}
            />
        </div>
    );
}
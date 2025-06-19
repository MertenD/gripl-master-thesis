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

    function handleElementClicked(element: any) {
        if (!isLabelMode || element.type !== "bpmn:Task") return
        const activityId = element.id
        if (highlightedActivityIds.includes(activityId)) {
            setHighlightedActivityIds(highlightedActivityIds.filter(id => id !== activityId))
            setHasUnsavedChanges(true)
        } else {
            setHighlightedActivityIds([...highlightedActivityIds, activityId])
            setHasUnsavedChanges(true)
        }
    }

    const cards = [
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
        } as BpmnToolCard
    ]

    return (
        <div className={`h-full ${className}`}>
            <BpmnEditor
                title={evaluationData.name || ""}
                bpmnXml={diagram}
                cards={cards}
                highlightedActivityIds={highlightedActivityIds}
                onDiagramChanged={handleDiagramChanged}
                onElementClicked={handleElementClicked}
                editorClassName={isLabelMode ? "border border-destructive" : ""}
                disableEditing={isLabelMode}
            />
        </div>
    );
}
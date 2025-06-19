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
            alert("Test case saved successfully!");
        }).catch(error => {
            console.error("Error while saving test case:", error);
            alert("Error while saving test case: " + error.message);
        });
    }

    function handleElementClicked(element: any) {
        if (!isLabelMode) return
        if (element.type === "bpmn:Task") {
            const activityId = element.id;
            if (highlightedActivityIds.includes(activityId)) {
                setHighlightedActivityIds(highlightedActivityIds.filter(id => id !== activityId));
            } else {
                setHighlightedActivityIds([...highlightedActivityIds, activityId]);
            }
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
                onDiagramChanged={setDiagram}
                onElementClicked={handleElementClicked}
                editorClassName={isLabelMode ? "border border-destructive" : ""}
                disableEditing={isLabelMode}
            />
        </div>
    );
}
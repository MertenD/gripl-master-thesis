"use client"

import BpmnEditor from "@/components/bpmn-editor";
import {EvaluationData, ExpectedValues} from "@/models/dto/EvaluationData";
import {BpmnToolCard} from "@/models/BpmnToolCard";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Save} from "lucide-react";
import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {BpmnEditorEvent} from "@/models/BpmnEditorEvent";
import LabelingEditorLabelCard from "@/components/labeling/labeling-editor-label-card";
import {Spinner} from "@/components/ui/spinner";

interface LabelingEditorProps {
    className?: string;
    evaluationData: EvaluationData;
}

export default function LabelingEditor({ className, evaluationData }: LabelingEditorProps) {
    const [diagram, setDiagram] = useState<string>(evaluationData.bpmnXml)
    const [isLabelMode, setIsLabelMode] = useState<boolean>(false);
    const [criticalActivities, setCriticalActivities] = useState<ExpectedValues[]>(evaluationData.expectedValues);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [selectedElement, setSelectedElement] = useState<any | null>(null);
    const [isSaveLoading, setIsSaveLoading] = useState(false);

    function onSave() {

        setIsSaveLoading(true);

        const xmlBlob = new Blob([diagram], { type: "application/xml" });
        const formData = new FormData();
        formData.append("bpmnFile", xmlBlob, "diagram.bpmn");
        formData.append("name", evaluationData.name);
        const expectedValuesBlob = new Blob(
            [JSON.stringify(criticalActivities)],
            { type: 'application/json' }
        );
        formData.append('expectedValues', expectedValuesBlob, 'expectedValues.json');

        fetch(`/api/dataset/testcase/${evaluationData.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            body: formData,
        }).then(response => {
            if (!response.ok) {
                console.error("Error while saving test case:", response.statusText);
                throw new Error("Fehler beim Speichern des Testfalls");
            }
            setHasUnsavedChanges(false)
            setIsSaveLoading(false);
            alert("Test case saved sccessfully!");
        }).catch(error => {
            console.error("Error while saving test case:", error);
            setIsSaveLoading(false);
            alert("Error while saving test case: " + error.message);
        })
    }

    function handleDiagramChanged(xml: string) {
        setDiagram(xml)
        setHasUnsavedChanges(true)
    }

    function handleElementLabelingChange(elementId: string, isChecked: boolean, reason: string) {
        if (isChecked) {
            if (!criticalActivities.some(critical => critical.value === elementId)) {
                setCriticalActivities([...criticalActivities, { value: elementId, reason: reason }]);
            } else {
                setCriticalActivities(criticalActivities.map(critical =>
                    critical.value === elementId ? { ...critical, reason: reason } : critical
                ));
            }
        } else {
            setCriticalActivities(criticalActivities.filter(critical => critical.value !== elementId))
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
                        disabled={!hasUnsavedChanges || isSaveLoading}
                        className={"min-w-[153px]"}
                    >
                        { isSaveLoading ? <>
                            <Spinner className="h-4 w-4 text-foreground" />
                            Saving...
                        </> : <>
                            <Save className="mr-2 h-4 w-4"/>
                            Save Test Case
                        </>}
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
            content: selectedElement && isLabelMode && <LabelingEditorLabelCard
                elementName={selectedElement.businessObject.name || "No Name"}
                elementId={selectedElement.id}
                criticalActivities={criticalActivities}
                onLabelingChange={handleElementLabelingChange}
            />
        }
    ]

    return (
        <div className={`h-full ${className}`}>
            <BpmnEditor
                title={evaluationData.name || ""}
                bpmnXml={diagram}
                cards={cards}
                highlightedActivityIds={criticalActivities.map(critical => critical.value)}
                onDiagramChanged={handleDiagramChanged}
                editorClassName={isLabelMode ? "border border-destructive" : ""}
                disableEditing={isLabelMode}
                onEvent={handleEditorEvent}
            />
        </div>
    );
}
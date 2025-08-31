"use client"

import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {Plus} from "lucide-react";
import emptyDiagram from "@/data/empty-diagram.bpmn";
import {Dataset} from "@/models/dto/Dataset";

interface CreateTestCaseButtonProps {
    dataset: Dataset;
}

export default function CreateTestCaseButton({ dataset }: CreateTestCaseButtonProps) {

    const router = useRouter()
    const [showCreateTestCaseDialog, setShowCreateTestCaseDialog] = React.useState(false)

    function handleTestCaseCreation() {
        const testCaseName = (document.getElementById("test-case-name") as HTMLInputElement).value;
        if (!testCaseName) {
            alert("Please enter a name for the test case.");
            return;
        }

        const xmlBlob = new Blob([emptyDiagram as string], { type: "application/xml" });
        const formData = new FormData();
        formData.append("bpmnFile", xmlBlob, "diagram.bpmn");
        formData.append("name", testCaseName);
        const expectedValuesBlob = new Blob(
            [JSON.stringify([])],
            { type: 'application/json' }
        );
        formData.append('expectedValues', expectedValuesBlob, 'expectedValues.json');
        formData.append("datasetId", dataset.id.toString());

        fetch("/api/dataset/testcase", {
            method: "POST",
            body: formData,
        } as RequestInit).then(response => {
            if (!response.ok) {
                throw new Error("Failed to create test case");
            }
            return response.json();
        }).then(id => {
            console.log("Created test case with ID:", id);
            router.push(`/labeling/${id}`)
            router.refresh()
            setShowCreateTestCaseDialog(false);
        }).catch(error => {
            console.error("There was an error creating the test case:", error);
            alert("Failed to create test case. Please try again.");
        })
    }

    return <Dialog open={showCreateTestCaseDialog} onOpenChange={setShowCreateTestCaseDialog}>
        <Button className="h-full" onClick={() => setShowCreateTestCaseDialog(true)}>
            <Plus />
            <span className="pl-2 text-center">Create Test Case</span>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create Test Case for dataset {dataset.name}</DialogTitle>
                <DialogDescription>Create a new test case for the evaluation pipeline.</DialogDescription>
            </DialogHeader>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="test-case-name">Name</Label>
                        <Input id="test-case-name" placeholder={"name"}/>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateTestCaseDialog(false)}>
                    Cancel
                </Button>
                <Button type="submit" onClick={handleTestCaseCreation}>Create</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
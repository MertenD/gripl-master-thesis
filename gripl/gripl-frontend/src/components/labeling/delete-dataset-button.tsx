"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import React from "react";
import deleteDataset from "@/actions/delete-dataset";
import {useRouter} from "next/navigation";
import {Dataset} from "@/models/dto/Dataset";

interface DeleteDatasetButtonProps {
    dataset: Dataset;
}

export default function DeleteDatasetButton({ dataset }: DeleteDatasetButtonProps) {

    const router = useRouter()
    const [showDeleteDatasetDialog, setShowDeleteDatasetDialog] = React.useState(false)

    function handleDatasetDeletion() {
        deleteDataset(dataset.id).then(() => router.refresh());
    }

    return <Dialog open={showDeleteDatasetDialog} onOpenChange={setShowDeleteDatasetDialog}>
        <Button variant="destructive" className="h-full" onClick={() => setShowDeleteDatasetDialog(true)}>
            <Trash2 />
            <span className="pl-2 text-center">Delete Dataset</span>
        </Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Dataset {dataset.name}</DialogTitle>
                <DialogDescription>Delete the dataset. All associated test cases will still exist in the database, but will no longer be associated with this dataset and will not be accessible through the UI.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDatasetDialog(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" type="submit" onClick={handleDatasetDeletion}>Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}
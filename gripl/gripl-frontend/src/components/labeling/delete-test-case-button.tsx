"use client"

import {Button} from "@/components/ui/button";
import {ConfirmationDialog} from "@/components/ui/confirmation-dialog";
import React, {useState} from "react";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";

export interface DeleteTestCaseButtonProps {
    testCaseId: number
    testCaseName?: string
}

export default function DeleteTestCaseButton({ testCaseId, testCaseName }: DeleteTestCaseButtonProps) {

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)
    const router = useRouter();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsConfirmDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (testCaseId) {
            try {
                const response = await fetch(`/api/dataset/testcase/${testCaseId}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    throw new Error(`Error deleting test case: ${response.statusText}`);
                }

                router.refresh();
            } catch (error) {
                console.error("There was an error deleting the test case:", error);
                alert("Failed to delete the test case. Please try again later.");
            }
        }
        setIsConfirmDialogOpen(false)
    };

    return <>
        <Button variant="destructive" className="z-10" size="icon" onClick={(e: React.MouseEvent) => handleDeleteClick(e)}>
            <Trash2 className="h-4 w-4" />
        </Button>
        <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            title={"Delete Test Case"}
            description={testCaseName ? "Are you sure you want to delete the test case '" + testCaseName + "'? This action cannot be undone."
                : "Are you sure you want to delete this test case? This action cannot be undone."}
            confirmLabel={"Delete"}
        />
    </>
}
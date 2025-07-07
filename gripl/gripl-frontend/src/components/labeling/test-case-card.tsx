"use client"

import {Card} from "@/components/ui/card";
import Link from "next/link";
import DeleteTestCaseButton from "@/components/labeling/delete-test-case-button";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import {Skeleton} from "@/components/ui/skeleton";
import useLoadPreviewImage from "@/hooks/use-load-preview-image";

interface TestCaseCardProps {
    metadata: EvaluationDataMeta
}

export default function TestCaseCard({ metadata } : TestCaseCardProps) {

    const { previewImage, isLoading} = useLoadPreviewImage({
        testCaseId: metadata.id,
        imageClassName: "w-auto h-28",
    })

    return <div className="flex flex-row items-center justify-between space-x-2 h-min">
        <Card className="flex-1 relative hover:bg-card/40">
            <Link href={`/labeling/${metadata.id}`}>
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-6 mr-12">{metadata.name || "Test Case"} ({metadata.id})</h2>
                    { isLoading && !previewImage && <Skeleton className="h-28 w-full" /> }
                    { previewImage }
                </div>
            </Link>
            <div className="absolute right-4 top-4">
                <DeleteTestCaseButton testCaseId={metadata.id} testCaseName={metadata.name}/>
            </div>
        </Card>
    </div>
}
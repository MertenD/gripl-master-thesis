"use client"

import {ImageIcon} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import useLoadPreviewImage from "@/hooks/use-load-preview-image";
import type {TestCaseReport} from "@/models/dto/ReportData";

interface TestCaseReportCardPreviewProps {
    report: TestCaseReport
}

export default function TestCaseReportCardPreview({ report }: TestCaseReportCardPreviewProps) {

    const { previewImage, isLoading } = useLoadPreviewImage({
        testCaseId: report.testCaseId,
        correctActivityIds: report.correctActivityIds,
        falsePositiveIds: report.falsePositiveIds,
        falseNegativeIds: report.falseNegativeIds,
    })

    return <div>
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Visual Preview
        </h3>
        <Card className="p-3">
            {isLoading ? (
                <Skeleton className="h-32 w-full rounded" />
            ) : (
                <div className="rounded overflow-hidden">{previewImage}</div>
            )}
        </Card>
    </div>
}
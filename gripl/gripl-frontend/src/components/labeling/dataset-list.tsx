"use client"

import {Card} from "@/components/ui/card";
import Link from "next/link";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import {useSelectedLayoutSegment} from "next/navigation";

interface DatasetListProps {
    evaluationMetadata: EvaluationDataMeta[];
    className?: string;
}

export default function DatasetList({ className, evaluationMetadata }: DatasetListProps) {
    const activeId = Number.parseInt(useSelectedLayoutSegment() || "")

    return <div className={`h-full flex flex-col ${className}`}>
        <h2 className="font-bold text-2xl p-4 pb-4">Test Cases</h2>
        <div className="flex-1 overflow-y-auto space-y-2 px-4">
            {evaluationMetadata.map((meta) =>
                <Card key={meta.id} className={`${activeId === meta.id ? "bg-primary" : ""}`}>
                    <Link href={`/labeling/${meta.id}`}>
                        <div className="flex flex-row items-center justify-start p-4">
                            <h2>{meta.name || "Test Case"} ({meta.id})</h2>
                        </div>
                    </Link>
                </Card>
            )}
        </div>
    </div>
}
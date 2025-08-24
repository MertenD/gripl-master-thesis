"use client"

import {useState} from "react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronDown, ChevronUp} from "lucide-react";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import TestCaseCard from "@/components/labeling/test-case-card";
import CreateTestCaseButton from "@/components/labeling/create-test-case-button";

interface DatasetListProps {
    datasetId: number;
    evaluationMetadata: EvaluationDataMeta[];
    className?: string;
}

export default function DatasetListItem({ className, evaluationMetadata, datasetId }: DatasetListProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mx-4">
        <div className="w-full flex flex-row h-20 mb-4 gap-2">
            <CollapsibleTrigger className="w-full">
                <Card className="w-full">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle>{datasetId}</CardTitle>
                        <>{ isOpen ? <ChevronDown /> : <ChevronUp /> }</>
                    </CardHeader>
                </Card>
            </CollapsibleTrigger>
            <CreateTestCaseButton datasetId={datasetId} />
        </div>
        <CollapsibleContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 overflow-y-auto gap-4 pb-4">
                {evaluationMetadata.map((meta) =>
                    <TestCaseCard metadata={meta} key={meta.id}/>
                )}
            </div>
        </CollapsibleContent>
    </Collapsible>
}
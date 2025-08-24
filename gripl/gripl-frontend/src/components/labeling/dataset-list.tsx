import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import CreateTestCaseButton from "@/components/labeling/create-test-case-button";
import TestCaseCard from "@/components/labeling/test-case-card";
import {Collapsible, CollapsibleTrigger} from "@/components/ui/collapsible";
import {CardHeader, CardTitle} from "@/components/ui/card";
import {ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";
import DatasetListItem from "@/components/labeling/dataset-list-item";

interface DatasetListProps {
    datasetIds: number[];
    evaluationMetadata: EvaluationDataMeta[];
    className?: string;
}

export default function DatasetList({ datasetIds, evaluationMetadata, className }: DatasetListProps) {
    return <div className={`h-full flex flex-col justify-start ${className}`}>
        { datasetIds.map(id =>
            <DatasetListItem datasetId={id} evaluationMetadata={evaluationMetadata.filter(meta => meta.datasetId == id)} key={`${id}-dataset-list-item`} className="mb-4" />
        )}
    </div>
}
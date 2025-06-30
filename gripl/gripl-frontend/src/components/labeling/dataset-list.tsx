import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import CreateTestCaseButton from "@/components/labeling/create-test-case-button";
import TestCaseCard from "@/components/labeling/test-case-card";

interface DatasetListProps {
    evaluationMetadata: EvaluationDataMeta[];
    className?: string;
}

export default function DatasetList({ className, evaluationMetadata }: DatasetListProps) {
    return <div className={`h-full flex flex-col justify-start ${className}`}>
        <div className="w-full flex flex-row justify-between">
            <h2 className="font-bold text-2xl p-4 pb-4">Test Cases</h2>
            <CreateTestCaseButton />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 overflow-y-auto gap-4 px-4 pb-4">
            {evaluationMetadata.map((meta) =>
                <TestCaseCard metadata={meta} key={meta.id} />
            )}
        </div>
    </div>
}
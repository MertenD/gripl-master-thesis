import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import DatasetListItem from "@/components/labeling/dataset-list-item";
import {Dataset} from "@/models/dto/Dataset";

interface DatasetListProps {
    datasets: Dataset[];
    evaluationMetadata: EvaluationDataMeta[];
    className?: string;
}

export default function DatasetList({ datasets, evaluationMetadata, className }: DatasetListProps) {
    return <div className={`h-full flex flex-col justify-start ${className}`}>
        { datasets.map(dataset =>
            <DatasetListItem
                dataset={dataset}
                evaluationMetadata={evaluationMetadata.filter(meta => meta.datasetId == dataset.id)}
                key={`${dataset.id}-dataset-list-item`} className="mb-4"
            />
        )}
    </div>
}
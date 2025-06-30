import {Card} from "@/components/ui/card";
import Link from "next/link";
import DeleteTestCaseButton from "@/components/labeling/delete-test-case-button";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import Image from "next/image";

interface TestCaseCardProps {
    metadata: EvaluationDataMeta
}

export default async function TestCaseCard({ metadata } : TestCaseCardProps) {

    const svgPreviewResponse = await fetch(`${process.env.API_BASE_URL}/dataset/${metadata.id}/preview`)

    if (!svgPreviewResponse.ok) {
        console.error(`Failed to fetch preview for test case ${metadata.id}: ${svgPreviewResponse.statusText}`);
        return <div className="flex items-center justify-center h-full">Failed to load preview</div>;
    }

    const svgPreview = await svgPreviewResponse.text();

    return <div className="flex flex-row items-center justify-between space-x-2 h-min">
        <Card className="flex-1 relative">
            <Link href={`/labeling/${metadata.id}`}>
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-6">{metadata.name || "Test Case"} ({metadata.id})</h2>
                    <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgPreview)}`}
                        alt={`Preview for ${metadata.name || "Test Case"}`}
                        width={100}
                        height={100}
                        className="h-24 w-auto"
                    />
                </div>
            </Link>
            <div className="absolute right-4 top-4">
                <DeleteTestCaseButton testCaseId={metadata.id} testCaseName={metadata.name}/>
            </div>
        </Card>
    </div>
}
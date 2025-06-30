"use client"

import {Card} from "@/components/ui/card";
import Link from "next/link";
import DeleteTestCaseButton from "@/components/labeling/delete-test-case-button";
import {EvaluationDataMeta} from "@/models/dto/EvaluationData";
import Image from "next/image";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface TestCaseCardProps {
    metadata: EvaluationDataMeta
}

export default function TestCaseCard({ metadata } : TestCaseCardProps) {

    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSvgPreview = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/dataset/${metadata.id}/preview`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch preview for test case ${metadata.id}: ${response.statusText}`);
                }

                const svgText = await response.text();
                setSvgPreview(svgText);
            } catch (error) {
                console.error(error);
                setSvgPreview(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSvgPreview().then();
    }, []);

    return <div className="flex flex-row items-center justify-between space-x-2 h-min">
        <Card className="flex-1 relative">
            <Link href={`/labeling/${metadata.id}`}>
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-6 mr-12">{metadata.name || "Test Case"} ({metadata.id})</h2>
                    { isLoading && !svgPreview && <Skeleton className="h-28 w-full" /> }
                    { svgPreview && <Image
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgPreview)}`}
                        alt={`Preview for ${metadata.name || "Test Case"}`}
                        width={100}
                        height={100}
                        className="h-28 w-auto"
                    /> }
                </div>
            </Link>
            <div className="absolute right-4 top-4">
                <DeleteTestCaseButton testCaseId={metadata.id} testCaseName={metadata.name}/>
            </div>
        </Card>
    </div>
}
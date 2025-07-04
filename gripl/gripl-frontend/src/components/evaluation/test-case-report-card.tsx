import {TestCaseReport} from "@/models/dto/ReportData";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface TestCaseReportCardProps {
    report: TestCaseReport
}

export default function TestCaseReportCard({ report }: TestCaseReportCardProps) {

    const themeProps = useTheme();
    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSvgPreview = async () => {
            setIsLoading(true);
            try {
                const relativeImageSrc = "/" + report.imageSrc.split("//")[1].split("/").slice(1).join("/");
                const response = await fetch(`${relativeImageSrc}&theme=${themeProps.resolvedTheme || "light"}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch preview for test case ${report.testCaseId}: ${response.statusText}`);
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
    }, [themeProps.resolvedTheme]);

    return <Card>
        <CardHeader>
            <CardTitle className="text-xl font-bold">Test Case {report.testCaseId} - {report.testCaseName}</CardTitle>
        </CardHeader>
        <CardContent>
            { isLoading && !svgPreview && <Skeleton className="h-28 w-full" /> }
            { svgPreview && <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(svgPreview)}`}
                alt={`Preview for ${report.testCaseName || "Test Case"}`}
                width={100}
                height={100}
                className="w-auto"
            /> }
            <ul className="mt-4">
                <li className="mb-1"><span className="font-bold">Expected:</span> {report.expectedNamesWithIds.join(", ")}</li>
                <li className="mb-1"><span className="font-bold">Actual:</span> {report.actualNamesWithIds.join(", ")}</li>
                <li className="mb-1"><span className="font-bold">Result:</span> {report.isSuccessful ? "✅ Passed" : "❌ Failed"}</li>
            </ul>
            <details className="mt-4">
                <summary><h2 className="text-lg font-bold mt-4">Reasoning of the LLM:</h2></summary>
                <ul className="mt-4">
                    { report.result.map((result) => {
                        return <li key={result.value} className="mb-1">
                            <span className="font-bold">{
                                report.actualNamesWithIds.find(nameWithId => nameWithId.includes(result.value)) || result.value
                            }:</span> {result.reason || "No reason provided"}
                        </li>
                    })}
                </ul>
            </details>
        </CardContent>
    </Card>
}
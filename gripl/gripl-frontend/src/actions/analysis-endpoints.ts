"use server"

export default async function fetchAnalysisEndpoints(): Promise<AnalysisEndpoint[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gdpr/analysis/endpoints`)
    if (!response.ok) {
        throw new Error(`Failed to fetch analysis endpoints: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}
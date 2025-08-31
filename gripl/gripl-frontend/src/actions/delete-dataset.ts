"use server"

export default async function deleteDataset(datasetId: number) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset/${datasetId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Error deleting dataset: ${response.statusText}`);
    }

    return;
}
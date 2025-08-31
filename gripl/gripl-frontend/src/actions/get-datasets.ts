import {Dataset} from "@/models/dto/Dataset";

export default async function getDatasets(): Promise<Dataset[]> {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store"
    })
        .then(data => {
            if (!data.ok) {
                throw new Error(`Failed to fetch datasets: ${data.statusText}`);
            }
            return data.json()
        })
        .catch(error => {
            console.error("There was an error fetching the datasets:", error);
            return []
        })

    return result as Dataset[];
}
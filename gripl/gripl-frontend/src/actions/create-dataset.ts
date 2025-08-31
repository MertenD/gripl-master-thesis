export default async function createDataset(name: string, description: string): Promise<number> {
    const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dataset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json() as unknown as { id: number };
        })
        .catch(error => {
            console.error("There was an error creating the dataset:", error);
            return null;
        });

    if (!result) {
        throw new Error("Failed to create dataset");
    }

    return result.id;
}
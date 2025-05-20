const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function Search(query) {
    try {
        const response = await fetch(`${backend_url}/search?search=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("Search results:", data);
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);
        throw error;
    }
}

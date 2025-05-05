const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllListings = async () => {
    try {
        const response = await fetch(`${backend_url}/listing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching listings:", error);
        throw error;
    }
}

export const fetchSingleListing = async (id) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching single listing:", error);
        throw error;
    }
}

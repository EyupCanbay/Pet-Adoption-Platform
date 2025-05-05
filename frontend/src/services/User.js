const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;


export const getSingleUser = async (user_id) => {
    try {
        const response = await fetch(`${backend_url}/users/${user_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when fetching user by Id ");
    }
    catch (error) {
        console.log("Error fetching user by Id");
    }
}

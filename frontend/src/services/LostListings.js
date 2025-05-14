const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllLostListings = async () => {
    try {
        const response = await fetch(`${backend_url}/lost_listing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lost listings:", error);
        throw error;
    }
}

export const createLostListing = async (formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating lost listing:", error);
        throw error;
    }
}

export const fetchSingleLostListing = async (id) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching single lost listing:", error);
        throw error;
    }
}

export const updateSingleLostListing = async (id, formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("updating single lost listing", data);
        return data;
    } catch (error) {
        console.error("Error updating single lost listing:", error);
        throw error;
    }
}

export const deleteLostListing = async (id) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("deleting single lost listing", data);
        return data;
    } catch (error) {
        console.error("Error deleting single lost listing:", error);
        throw error;
    }
}


export const createLostListingsBookmarksbyPetId = async (id) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lost listings bookmarks by pet id:", error);
        throw error;
    }
}

export const getLostListingsCommentsbyPetId = async (id) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("fetching lost listings comments by pet id", data);
        return data;
    } catch (error) {
        console.error("Error fetching lost listings comments by pet id:", error);
        throw error;
    }
}

export const createLostListingsComment = async (id, formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("creating lost listings comment", data);
        return data;
    } catch (error) {
        console.error("Error creating lost listings comment:", error);
        throw error;
    }
}

export const updateLostListingsComment = async (id, commentId, formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("updating lost listings comment", data);
        return data;
    } catch (error) {
        console.error("Error updating lost listings comment:", error);
        throw error;
    }
}

export const deleteLostListingsComment = async (id, commentId) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("deleting lost listings comment", data);
        return data;
    } catch (error) {
        console.error("Error deleting lost listings comment:", error);
        throw error;
    }
}

export const getLostListingsCommentReplies = async (id, commentId) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}/reply_comment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching lost listings comment replies:", error);
        throw error;
    }
}

export const updateLostListingsCommentReply = async (id, commentId, replyId, formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}/reply_comment/${replyId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("updating lost listings comment reply", data);
        return data;
    } catch (error) {
        console.error("Error updating lost listings comment reply:", error);
        throw error;
    }
}

export const deleteLostListingsCommentReply = async (id, commentId, replyId) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}/reply_comment/${replyId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("deleting lost listings comment reply", data);
        return data;
    } catch (error) {
        console.error("Error deleting lost listings comment reply:", error);
        throw error;
    }
}

export const createLostListingsCommentReply = async (id, commentId, formData) => {
    try {
        const response = await fetch(`${backend_url}/lost_listing/${id}/comment/${commentId}/reply_comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log("creating lost listings comment reply", data);
        return data;
    } catch (error) {
        console.error("Error creating lost listings comment reply:", error);
        throw error;
    }
}
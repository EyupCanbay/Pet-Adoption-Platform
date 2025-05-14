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
        // console.log("All listings fetched:", data);
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

export const createListing = async (listingData) => {
    try {
        const response = await fetch(`${backend_url}/listing`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(listingData),
        });
        const data = await response.json();
        console.log("Listing created:", data);
        return data;
    } catch (error) {
        console.error("Error creating listing:", error);
        throw error;
    }
}

export const updateListing = async (id, listingData) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(listingData),
        });
        const data = await response.json();
        console.log("Listing updated:", data);
        return data;
    } catch (error) {
        console.error("Error updating listing:", error);
        throw error;
    }
}

export const deleteListing = async (id) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("Listing deleted:", data);
        return data;
    } catch (error) {
        console.error("Error deleting listing:", error);
        throw error;
    }
}

export const createListingToBookmarkByUser = async (id) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error bookmarking listing:", error);
        throw error;
    }
}

export const getListingComments = async (id) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}/comment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("Listing comments fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching listing comments:", error);
        throw error;
    }
}

export const createListingComment = async (id, commentData) => {
    try {
        const response = await fetch(`${backend_url}/listing/${id}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(commentData),
        });
        const data = await response.json();
        console.log("Listing comment created:", data);
        return data;
    } catch (error) {
        console.error("Error creating listing comment:", error);
        throw error;
    }
}

export const getListingSingleComment = async (listingId, commentId) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("Single listing comment fetched:", data);
        return data;
    } catch (error) {
        console.error("Error fetching single listing comment:", error);
        throw error;
    }
}

export const updateListingComment = async (listingId, commentId, commentData) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(commentData),
        });
        const data = await response.json();
        console.log("Listing comment updated:", data);
        return data;
    } catch (error) {
        console.error("Error updating listing comment:", error);
        throw error;
    }
}

export const deleteListingComment = async (listingId, commentId) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("Listing comment deleted:", data);
        return data;
    } catch (error) {
        console.error("Error deleting listing comment:", error);
        throw error;
    }
}

export const getListingCommentReplyComment = async (listingId, commentId) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}/reply_comment`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching listing comment reply comments:", error);
        throw error;
    }
}

export const createListingCommentReplyComment = async (listingId, commentId, replyCommentData) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}/reply_comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(replyCommentData),
        });
        const data = await response.json();
        console.log("Listing comment reply comment created:", data);
        return data;
    } catch (error) {
        console.error("Error creating listing comment reply comment:", error);
        throw error;
    }
}

export const updateListingCommentReplyComment = async (listingId, commentId, replyCommentId, replyCommentData) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}/reply_comment/${replyCommentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(replyCommentData),
        });
        const data = await response.json();
        console.log("Listing comment reply comment updated:", data);
        return data;
    } catch (error) {
        console.error("Error updating listing comment reply comment:", error);
        throw error;
    }
}

export const deleteListingCommentReplyComment = async (listingId, commentId, replyCommentId) => {
    try {
        const response = await fetch(`${backend_url}/listing/${listingId}/comment/${commentId}/reply_comment/${replyCommentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        console.log("Listing comment reply comment deleted:", data);
        return data;
    } catch (error) {
        console.error("Error deleting listing comment reply comment:", error);
        throw error;
    }
}

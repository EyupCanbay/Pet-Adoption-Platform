const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${backend_url}/users`, {
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
        throw new Error("Error in response when fetching all users ");
    }
    catch (error) {
        console.log("Error fetching all users");
    }
}

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
            // console.log("data", data);
            return data;
        }
        throw new Error("Error in response when fetching user by Id ");
    }
    catch (error) {
        console.log("Error fetching user by Id");
    }
}

export const fetchCurrentUser = async (token) => {
    try {
        const res = await fetch(`${backend_url}/users/me`, {
            headers: {
                Cookie: `token=${token}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) return null;

        const json = await res.json();
        return {
            ...json.data.user,
            location: json.data.location,
        };
    } catch (error) {
        console.error('Sunucu tarafı kullanıcı fetch hatası:', error);
        return null;
    }
};

export const updateCurrentUser = async (formData) => {
    try {
        const response = await fetch(`${backend_url}/users/me`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                userData: {
                    data: formData,
                }
            }),
        })
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when updating user ");
    }
    catch (error) {
        console.log("Error updating user");
    }
}

export const getCurrentUsersNotifications = async () => {
    try {
        const response = await fetch(`${backend_url}/users/me/notifications`, {
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

export const deleteCurrentUserNotification = async (notificationId) => {
    try {
        const response = await fetch(`${backend_url}/users/me/notifications/${notificationId}`, {
            method: "DELETE",
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
        throw new Error("Error in response when deleting user notification ");
    }
    catch (error) {
        console.log("Error deleting user notification");
    }
}

export const blockUser = async (userId) => {
    try {
        const response = await fetch(`${backend_url}/users/block/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when blocking user ");
    } catch (error) {
        console.log("Error blocking user");
    }
}

export const unblockUser = async (userId) => {
    try {
        const response = await fetch(`${backend_url}/users/block/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when unblocking user ");
    } catch (error) {
        console.log("Error unblocking user");
    }
}

export const fetchCurrentUserBlockedUsers = async () => {
    try {
        const response = await fetch(`${backend_url}/users/me/block`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        // console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching current user's blocked users:", error);
        throw error;
    }
}

export const reportUser = async (userId, formData) => {
    try {
        const response = await fetch(`${backend_url}/users/report/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        });
        console.log("response", response);
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when reporting user ");
    } catch (error) {
        console.log("Error reporting user");
    }
}

export const fetchUsersReports = async () => {
    try {
        const response = await fetch(`${backend_url}/users/report/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        // console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching users reports:", error);
        throw error;
    }
}

export const banUser = async (userId) => {
    try {
        const response = await fetch(`${backend_url}/users/report/admin/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when banning user ");
    } catch (error) {
        console.log("Error banning user");
    }
}

export const fetchCurrentUsersListings = async () => {
    try {
        const response = await fetch(`${backend_url}/users/me/listing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        // console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching current user's listings:", error);
        throw error;
    }
}

export const deleteCurrentUserBookmarkById = async (listingId) => {
    try {
        const response = await fetch(`${backend_url}/users/me/bookmarks/${listingId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response) {
            const data = await response.json();
            console.log("data", data);
            return data;
        }
        throw new Error("Error in response when deleting user bookmark ");
    } catch (error) {
        console.log("Error deleting user bookmark");
    }
}

export const fetchCurrentUserBookmarks = async () => {
    try {
        const response = await fetch(`${backend_url}/users/me/bookmarks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        // console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching current user's bookmarks:", error);
        throw error;
    }
}

export const fetchListingByUserId = async (userId) => {
    try {
        const response = await fetch(`${backend_url}/users/${userId}/listing`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        // console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching listings by user ID:", error);
        throw error;
    }
}
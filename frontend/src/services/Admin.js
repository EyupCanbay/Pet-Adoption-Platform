const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllAuditLogs = async () => {
    try {
        const response = await fetch(`${backend_url}/admin/auditlogs `, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Failed to fetch audit logs');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};


export const updateUserRole = async (role, userId) => {
    try {
        const response = await fetch(`${backend_url}/admin/changing_role/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role }),
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Failed to update user role');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};

export const banUser = async (userId, banDuration) => {
    try {
        const response = await fetch(`${backend_url}/users/report/admin/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ banDuration }),
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


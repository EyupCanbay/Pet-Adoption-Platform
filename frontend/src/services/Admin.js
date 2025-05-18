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
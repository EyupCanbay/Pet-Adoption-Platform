const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllCategories = async () => {

    try {
        const response = await fetch(`${backend_url}/category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response) {
            throw new Error(`Error: ${response.status} ${response.message}`);
        }
        const data = await response.json();
        // console.log("Categories fetched successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}


export const createCategory = async (formData) => {
    try {
        const response = await fetch(`${backend_url}/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.message}`);
        }
        const data = await response.json();
        // console.log("Category created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
}

export const updateCategory = async (id, formData) => {
    try {
        const response = await fetch(`${backend_url}/category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.message}`);
        }
        const data = await response.json();
        console.log("Category updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

export const deleteCategory = async (id) => {
    try {
        const response = await fetch(`${backend_url}/category/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.message}`);
        }
        const data = await response.json();
        console.log("Category deleted successfully:", data);
        return data;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}


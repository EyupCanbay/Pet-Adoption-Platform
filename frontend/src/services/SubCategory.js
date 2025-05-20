const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAllSubCategories = async () => {
    try {
        const response = await fetch(`${backend_url}/subcategory`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch subcategories");
        }

        const data = await response.json();
        // console.log("Subcategories fetched successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
    }
}

export const getSubCategoryById = async (id) => {
    try {
        const response = await fetch(`${backend_url}/subcategory/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch subcategory");
        }

        const data = await response.json();
        console.log("Subcategory fetched successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        throw error;
    }
}

export const updateSubCategory = async (id, formData) => {
    try {
        const response = await fetch(`${backend_url}/subcategory/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await response.json();
        console.log("Subcategory updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating subcategory:", error);
        throw error;
    }
}

export const deleteSubCategory = async (id) => {
    try {
        const response = await fetch(`${backend_url}/subcategory/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete subcategory");
        }

        const data = await response.json();
        console.log("Subcategory deleted successfully:", data);
        return data;
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        throw error;
    }
}

export const createSubCategoryByCategoryId = async (categoryId, formData) => {
    try {
        const response = await fetch(`${backend_url}/category/${categoryId}/subcategory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            credentials: 'include',
        });
        const data = await response.json();
        console.log("Subcategory created successfully:", data);
        return data;
    } catch (error) {
        console.error("Error creating subcategory:", error);
        throw error;
    }
}
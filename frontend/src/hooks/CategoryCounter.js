"use client"
import { useState, useEffect } from "react";
import Categories from "@/mocks/categories.json";

function useCategoryCounts() {
    const [categoryCounts, setCategoryCounts] = useState([]);

    useEffect(() => {
        const fetchCounts = () => {
            if (Categories?.data) {
                const counts = Categories.data.map((category) => {
                    const subCategories = category?.subCategory_id?.map((sub) => ({
                        id: sub.id,
                        name: sub.name,
                        count: sub.count || 0,
                    })) || [];

                    return {
                        id: category.id,
                        name: category.name,
                        count: category.count || 0,
                        subCategories,
                    };
                });

                setCategoryCounts(counts);
            }
        };

        fetchCounts();
    }, []);

    return categoryCounts;
}

export default useCategoryCounts;

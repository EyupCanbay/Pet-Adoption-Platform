import { create } from "zustand";

export const useListingStore = create((set) => ({
    listing: {
        _id: "",
        user_id: null,
        category_name: "",
        sub_category_name: "",
        comment_id: [],
        petName: "",
        age: 0,
        gender: true, // true for male, false for female
        description: "",
        images: [],
        status: false, // false means not adopted
        additionalInfo: {
            color: "",
            eyeColor: "",
            furType: "",
            size: "small", // "small" | "medium" | "large"
            weight: 0,
            vaccinated: true,
            vaccinated_last_date: null,
            neutered: true,
            trainability: "easy", // "easy" | "medium" | "hard"
            playfulness: 3, // 1 to 5
            sociality: "medium", // "low" | "medium" | "high"
        },
        createdAt: "",
    },

    setListing: (newListing) => set({ listing: newListing }),

    updateListingField: (field, value) =>
        set((state) => ({
            listing: {
                ...state.listing,
                [field]: value,
            },
        })),

    updateAdditionalInfoField: (field, value) =>
        set((state) => ({
            listing: {
                ...state.listing,
                additionalInfo: {
                    ...state.listing.additionalInfo,
                    [field]: value,
                },
            },
        })),
}));
import { create } from "zustand";

export const useLostListingStore = create((set) => ({
    lostListing: {
        _id: "",
        user_id: null,
        category_name: "",
        sub_category_name: "",
        comment_id: [],
        petName: "",
        age: 0,
        gender: true, // true = male, false = female
        description: "",
        images: [],
        status: false, // found = true, not found = false (optional)
        additionalInfo: {
            color: "",
            eyeColor: "",
            furType: "",
            size: "small", // "small" | "medium" | "large"
            weight: 0,
            vaccinated: false,
            vaccinated_last_date: null,
            trainability: "", // optional: "easy" | "medium" | "hard"
            playfulness: 3, // optional: 1-5
            sociality: "", // optional: "low" | "medium" | "high"
        },
        createdAt: "",
    },

    setLostListing: (newListing) => set({ lostListing: newListing }),

    updateLostListingField: (field, value) =>
        set((state) => ({
            lostListing: {
                ...state.lostListing,
                [field]: value,
            },
        })),

    updateLostAdditionalInfoField: (field, value) =>
        set((state) => ({
            lostListing: {
                ...state.lostListing,
                additionalInfo: {
                    ...state.lostListing.additionalInfo,
                    [field]: value,
                },
            },
        })),
}));
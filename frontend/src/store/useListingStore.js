import { create } from "zustand";

export const useListingStore = create((set) => ({
    listing: {
        category_name: "",
        sub_category_name: "",
        comment_id: [],
        petName: "",
        age: 0,
        gender: true,
        description: "",
        images: [],
        status: false, 
        additionalInfo: {
            color: "",
            eyeColor: "",
            furType: "",
            size: "small", 
            weight: 0,
            vaccinated: true,
            vaccinated_last_date: null,
            neutered: true,
            trainability: "easy",
            playfulness: 3,
            sociality: "medium",    
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
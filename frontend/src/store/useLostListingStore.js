import { create } from "zustand";

export const useLostListingStore = create((set) => ({
    lostListing: {
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
            size: "", 
            weight: 0,
            vaccinated: false,
            vaccinated_last_date: null,
            trainability: "", 
            playfulness: 3,
            sociality: "", 
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
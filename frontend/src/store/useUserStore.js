import { create } from 'zustand'

export const useUserStore = create((set) => ({
    user: {
        _id: '',
        userName: '',
        email: '',
        password: '',
        name: '',
        surname: '',
        birthdate: '',
        phoneNumber: '',
        profilePhoto: '',
        bio: '',
        gender: '',
        authType: '',
        social_links: [],
        job: '',
        blockedUser: [],
        bookmarks: [],
        rates: [],
        is_active: true,
        forbiddenTime: null,
        banCount: 0,
        role: [],
        notifications: [],
        createdAt: '',
        updatedAt: ''
    },
    location: {
        _id: '',
        neighborhood: '',
        city: '',
        state: '',
        country: ''
    },
    setUser: (newUser) => set({ user: newUser }),
    updateUserField: (field, value) =>
        set((state) => ({
            user: {
                ...state.user,
                data: {
                    ...state.user.data,
                    user: {
                        ...state.user.data.user,
                        [field]: value,
                    },
                },
            },
        })),

    setLocation: (newLocation) => set({ location: newLocation }),
    updateLocationField: (field, value) =>
        set((state) => ({
            location: {
                ...state.location,
                [field]: value,
            },
        }))
}))

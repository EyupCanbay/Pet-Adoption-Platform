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
        location: null,
        createdAt: '',
        updatedAt: ''
    },
    setUser: (newUser) => set({ user: newUser }),
    updateUserField: (field, value) => set((state) => ({
        user: { ...state.user, [field]: value }
    })),
}))

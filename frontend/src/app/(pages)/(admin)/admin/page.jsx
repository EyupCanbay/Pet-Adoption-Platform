"use client"
import AdminPageContainer from '@/src/containers/AdminPageContainer'
import React from 'react'
import { ThemeProvider } from '@material-tailwind/react'

function AdminPanel() {
    return (
        <ThemeProvider>
            <AdminPageContainer />
        </ThemeProvider>
    )
}

export default AdminPanel
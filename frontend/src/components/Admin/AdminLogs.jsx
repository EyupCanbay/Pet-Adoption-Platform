"use client"
import React, { useEffect, useState } from 'react'
import { getAllAuditLogs } from '@/src/services/Admin'
import Loading from '../Loading'

const ITEMS_PER_PAGE = 15

function AdminLogs() {
    const [logs, setLogs] = useState([])
    const [sortDesc, setSortDesc] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await getAllAuditLogs()
                setLogs(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching logs:', error)
            }
        }

        fetchLogs()
    }, [])

    const toggleSortOrder = () => {
        setSortDesc((prev) => !prev)
        setCurrentPage(1)
    }

    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        return sortDesc ? dateB - dateA : dateA - dateB
    })

    const totalPages = Math.ceil(sortedLogs.length / ITEMS_PER_PAGE)
    const paginatedLogs = sortedLogs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    return loading ? (
        <Loading />
    ) : (
        <div className="flex flex-col w-full h-full p-6 overflow-auto text-white">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admin Logs</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700 table-fixed">
                    <thead>
                        <tr >
                            <th className="py-2 px-4 border-b border-gray-600 w-1/6 text-left">ID</th>
                            <th className="py-2 px-4 border-b border-gray-600 w-1/6 text-left">Level</th>
                            <th className="py-2 px-4 border-b border-gray-600 w-1/6 text-left">Location</th>
                            <th className="py-2 px-4 border-b border-gray-600 w-1/6 text-left">Process</th>
                            <th className="py-2 px-4 border-b border-gray-600 w-1/6 text-left">Log</th>
                            <th onClick={toggleSortOrder}
                                className="py-2 px-4 border-b border-gray-600 cursor-pointer select-none w-1/6 text-left" 
                            >
                                <div className="flex items-center gap-1">
                                    Zaman
                                    {sortDesc ? (
                                        <span className="text-sm">▲</span>
                                    ) : (
                                        <span className="text-sm">▼</span>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-700 transition">
                                <td className="py-2 px-4 border-b border-gray-600 text-left truncate">{log._id}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-left">{log.level}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-left">{log.location}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-left">{log.processType}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-left">{log.log}</td>
                                <td className="py-2 px-4 border-b border-gray-600 text-left">
                                    {new Date(log.created_at).toLocaleString("tr-TR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                >
                    Önceki
                </button>
                <span>
                    Sayfa {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                >
                    Sonraki
                </button>
            </div>
        </div>
    )
}

export default AdminLogs
"use client"
import React, { useEffect, useState } from 'react'
import { getAllUsers } from '@/src/services/User'
import { updateUserRole } from '@/src/services/Admin'
import Loading from '../Loading'
import { FaEdit } from 'react-icons/fa'
import { Button, Option, Select } from '@material-tailwind/react'

function AdminUserPanel() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedUser, setSelectedUser] = useState(null)
    const [roleInput, setRoleInput] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers()
            setUsers(data.data)
            setLoading(false)
        }
        fetchUsers()
    }, [])

    const indexOfLastItem = activePage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(users.length / itemsPerPage)

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber)
    }

    const openModal = (user) => {
        setSelectedUser(user)
        setRoleInput(user.role)
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await updateUserRole(roleInput, selectedUser._id)
        if (!result.error) {
            const updatedUsers = users.map(user =>
                user._id === selectedUser._id ? { ...user, role: roleInput } : user
            )
            setUsers(updatedUsers)
            setModalOpen(false)
        } else {
            alert("Güncelleme başarısız: " + result.error)
        }
    }


    return (
        <div className="p-4">
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Kullanıcılar</h2>
                    <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm">
                        <thead>
                            <tr >
                                <th className="border-b border-gray-300 px-5 py-3 text-left text-white font-semibold tracking-wide">Ad</th>
                                <th className="border-b border-gray-300 px-5 py-3 text-left text-white font-semibold tracking-wide">Soyad</th>
                                <th className="border-b border-gray-300 px-5 py-3 text-left text-white font-semibold tracking-wide">Kullanıcı Adı</th>
                                <th className="border-b border-gray-300 px-5 py-3 text-left text-white font-semibold tracking-wide">Email</th>
                                <th className="border-b border-gray-300 px-5 py-3 text-left text-white font-semibold tracking-wide">Rol</th>
                                <th className="border-b border-gray-300 px-5 py-3 text-center text-white font-semibold tracking-wide">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(user => (
                                <tr
                                    key={user._id}
                                >
                                    <td className="border-b border-gray-200 px-5 py-4 text-white">{user.name}</td>
                                    <td className="border-b border-gray-200 px-5 py-4 text-white">{user.surname}</td>
                                    <td className="border-b border-gray-200 px-5 py-4 text-white">{user.userName}</td>
                                    <td className="border-b border-gray-200 px-5 py-4 text-white">{user.email}</td>
                                    <td className="border-b border-gray-200 px-5 py-4 text-white font-semibold">{user.role}</td>
                                    <td className="border-b border-gray-200 px-5 py-4 text-center">
                                        <button
                                            onClick={() => openModal(user)}
                                            aria-label="Edit Role"
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-center mt-5 space-x-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-9 h-9 rounded-full text-sm font-medium transition
                                        ${activePage === i + 1
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}
                                    `}
                                aria-label={`Sayfa ${i + 1}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className=" p-6 rounded-lg w-[80%] max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Rolü Düzenle</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Select
                                className='flex text-center items-center text-white rounded-lg'
                                variant="outlined"
                                onChange={(value => setRoleInput(value))}

                            >
                                <Option className='text-black p-2 hover:bg-gray-100 text-md' value="ADMIN">ADMIN</Option>
                                <Option className='text-black p-2 hover:bg-gray-100 text-md' value="USER">USER</Option>
                            </Select>


                            <div className="flex justify-end space-x-2">
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant='outlined'
                                    className="border rounded cursor-pointer hover:bg-red-500 hover:text-white"
                                    color="red"
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    variant='outlined'
                                    className="border rounded cursor-pointer hover:bg-green-500 hover:text-white"
                                    color="green"
                                >
                                    Kaydet
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUserPanel
// This code defines an AdminUserPanel component that displays a list of users in a table format.
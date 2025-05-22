"use client"
import React, { useEffect, useState } from 'react'
import { getAllUsers, getSingleUser } from '@/src/services/User'
import { updateUserRole, banUser } from '@/src/services/Admin'
import Loading from '../Loading'
import { FaBan, FaEdit, FaEyeSlash } from 'react-icons/fa'
import { Button, Option, Select } from '@material-tailwind/react'

function AdminUserPanel() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [selectedUser, setSelectedUser] = useState(null)
    const [roleInput, setRoleInput] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [banModalOpen, setBanModalOpen] = useState(false)
    const [banDuration, setBanDuration] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllUsers()
            const usersWithActiveStatus = await Promise.all(
                data.data.map(async (user) => {
                    const userDetails = await getSingleUser(user._id)
                    return {
                        ...user,
                        is_active: userDetails.data?.user?.is_active ?? true,
                        isBanned: userDetails.data?.user?.is_active === false
                    }
                })
            )
            setUsers(usersWithActiveStatus)
            setLoading(false)
        }
        fetchUsers()
    }, [])

    const indexOfLastItem = activePage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(users.length / itemsPerPage)

    const handlePageChange = (pageNumber) => setActivePage(pageNumber)

    const openModal = (user) => {
        setSelectedUser(user)
        setRoleInput(user.role)
        setModalOpen(true)
    }

    const openBanModal = (user) => {
        setSelectedUser(user)
        setBanModalOpen(true)
    }

    const handleRoleSubmit = async (e) => {
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

    const handleBanSubmit = async () => {
        if (banDuration === null || selectedUser === null) return

        const result = await banUser(selectedUser._id, banDuration)
        if (!result.error) {
            const updatedUsers = users.map(user =>
                user._id === selectedUser._id ? { ...user, is_active: !user.is_active } : user
            )
            setUsers(updatedUsers)
            setBanModalOpen(false)
        } else {
            alert("Banlama başarısız: " + result.error)
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
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="border-b border-gray-300 px-4 py-3 text-left text-white font-semibold w-[12%]">Ad</th>
                                <th className="border-b border-gray-300 px-4 py-3 text-left text-white font-semibold w-[12%]">Soyad</th>
                                <th className="border-b border-gray-300 px-4 py-3 text-left text-white font-semibold w-[15%]">Kullanıcı Adı</th>
                                <th className="border-b border-gray-300 px-4 py-3 text-left text-white font-semibold w-[25%]">Email</th>
                                <th className="border-b border-gray-300 px-4 py-3 text-center text-white font-semibold w-[15%]">Rol</th>
                                <th className="border-b border-gray-300 px-4 py-3 text-center text-white font-semibold w-[15%]">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(user => (
                                <tr key={user._id} className={`${user.is_active === false ? 'bg-gray-800 text-gray-400' : ''}`}>
                                    <td className="border-b border-gray-200 px-4 py-3 text-left">{user.name}</td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-left">{user.surname}</td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-left">{user.userName}</td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-left break-words">{user.email}</td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-center font-semibold">{user.role}</td>
                                    <td className="border-b border-gray-200 px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => openModal(user)}
                                                aria-label="Edit Role"
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => openBanModal(user)}
                                                aria-label={user.isBanned ? "Unban User" : "Ban User"}
                                                className={`transition-colors ${user.isBanned ? "text-green-600 hover:text-green-800" : "text-red-600 hover:text-red-800"}`}
                                            >
                                                {user.is_active
                                                    ? <FaBan size={18} />
                                                    : (
                                                        user?.forbiddenTime
                                                            ? new Date(user.forbiddenTime).toLocaleDateString("tr-TR")
                                                            : "Banlı"
                                                    )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="flex justify-center mt-5 space-x-3">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-9 h-9 rounded-full text-sm font-medium transition
                                    ${activePage === i + 1
                                        ? 'bg-red-600 text-white shadow-md'
                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className=" p-6 rounded-lg w-[80%] max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Rolü Düzenle</h3>
                        <form onSubmit={handleRoleSubmit} className="space-y-4">
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
            {banModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="p-6 rounded-lg w-[80%] max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Ban Süresi Seç(Gün)</h3>
                        <Select
                            className='flex text-center items-center text-white rounded-lg'
                            variant="outlined"
                            onChange={(val) => setBanDuration(parseInt(val))}
                        >
                            <Option className='text-black p-2 hover:bg-gray-100 text-md' value="1">1 Gün</Option>
                            <Option className='text-black p-2 hover:bg-gray-100 text-md' value="2">2 Gün</Option>
                            <Option className='text-black p-2 hover:bg-gray-100 text-md' value="7">7 Gün</Option>
                            <Option className='text-black p-2 hover:bg-gray-100 text-md' value="30">30 Gün</Option>
                            <Option className='text-black p-2 hover:bg-gray-100 text-md' value="3650">Kalıcı Ban</Option>
                        </Select>
                        <div className="flex justify-end space-x-2 mt-4">
                            <Button
                                onClick={() => setBanModalOpen(false)}
                                variant='outlined'
                                color="red"
                                className='border rounded cursor-pointer hover:bg-red-500 hover:text-white'
                            >
                                İptal
                            </Button>
                            <Button
                                onClick={handleBanSubmit}
                                variant='outlined'
                                color="green"
                                className='border rounded cursor-pointer hover:bg-green-500 hover:text-white'
                            >
                                Banla
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUserPanel

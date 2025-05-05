"use client"

import React, { useEffect, useState } from "react"
import { Pencil, Save, X, XIcon } from "lucide-react"
import User from "@/mocks/users.json"
import { Instagram, Facebook, Twitter } from "lucide-react"

function Settings() {
    const [currentUser, setCurrentUser] = useState(null)
    const [tempUser, setTempUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [socialLinks, setSocialLinks] = useState({
        instagram: "",
        facebook: "",
        twitter: "",
    })

    const handleSocialLinkChange = (e, platform) => {
        const { value } = e.target
        setSocialLinks((prev) => ({
            ...prev,
            [platform]: value,
        }))
    }

    useEffect(() => {
        const userData = User.data[0]
        setCurrentUser(userData)
        setTempUser(userData)
    }, [])

    const handleEdit = () => setIsEditing(true)

    const handleCancel = () => {
        setIsEditing(false)
        setTempUser(currentUser)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setTempUser((prev) => {
            const currentField = prev[name]

            // Eğer field bir array ise (örneğin social_links gibi)
            if (Array.isArray(currentField)) {
                const index = parseInt(e.target.dataset.index) // indexi data attribute'dan alıyoruz
                const updatedArray = [...currentField]
                updatedArray[index] = value

                return {
                    ...prev,
                    [name]: updatedArray,
                }
            } else {
                // Normal string, date vs.
                return {
                    ...prev,
                    [name]: value,
                }
            }
        })
    }

    const handleAddSocialLink = () => {
        setTempUser((prev) => ({
            ...prev,
            social_links: [...prev.social_links, ""],
        }))
    }

    const handleSave = (e) => {
        e.preventDefault()
        setCurrentUser(tempUser)
        setIsEditing(false)
        console.log("Saved user (mock):", tempUser)
    }

    if (!tempUser) {
        return <div className="text-center mt-10">Loading...</div>
    }

    return (
        <div className="max-w-4xl mx-auto py-15">


            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
                {/* Personal Info */}
                <div className="flex items-center gap-4 justify-between mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Kişisel Bilgiler</h2>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg"
                        >
                            <Pencil size={18} /> Düzenle
                        </button>
                    )}
                </div>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block mb-2 font-medium">Ad</label>
                            <input
                                type="text"
                                name="name"
                                value={tempUser.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        {/* Surname */}
                        <div>
                            <label className="block mb-2 font-medium">Soyadı</label>
                            <input
                                type="text"
                                name="surname"
                                value={tempUser.surname}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        {/* Kullanıcı Adı */}
                        <div>
                            <label className="block mb-2 font-medium">Kullanıcı Adı</label>
                            <input
                                type="text"
                                name="userName"
                                value={tempUser.userName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={tempUser.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        {/* Telefon Numarası */}
                        <div>
                            <label className="block mb-2 font-medium">Telefon Numarası</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={tempUser.phoneNumber}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>

                        {/* Doğum Tarihi */}
                        <div>
                            <label className="block mb-2 font-medium">Doğum Tarihi</label>
                            <input
                                type="date"
                                name="birthdate"
                                value={tempUser.birthdate.split("T")[0]} // T'yi ayırıp sadece tarihi alıyoruz
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    </div>
                </section>
                {/*Social links */}
                <section>
                    <label className="block mb-4 text-xl font-semibold text-gray-700">Sosyal Medya Linkleri</label>
                    <div className="space-y-4">
                        {/* Instagram */}
                        <div className="flex items-center gap-4 mb-4">
                            <Instagram size={24} className="text-purple-600" />
                            <input
                                type="url"
                                value={socialLinks.instagram}
                                onChange={(e) => handleSocialLinkChange(e, "instagram")}
                                placeholder="Instagram Linki"
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Facebook */}
                        <div className="flex items-center gap-4 mb-4">
                            <Facebook size={24} className="text-blue-600" />
                            <input
                                type="url"
                                value={socialLinks.facebook}
                                onChange={(e) => handleSocialLinkChange(e, "facebook")}
                                placeholder="Facebook Linki"
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>

                        {/* Twitter */}
                        <div className="flex items-center gap-4 mb-4">
                            <Twitter size={24} className="text-blue-400" />
                            <input
                                type="url"
                                value={socialLinks.twitter}
                                onChange={(e) => handleSocialLinkChange(e, "twitter")}
                                placeholder="Twitter Linki"
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </section>

                {/* Save and Cancel Buttons */}
                {isEditing && (
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 flex justify-center items-center gap-1 px-3 py-2 rounded-lg cursor-pointer"
                            disabled={!isEditing}
                        >
                            <XIcon size={18} />İptal
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                        >
                            <Save size={18} /> Değişiklikleri Kaydet
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Settings

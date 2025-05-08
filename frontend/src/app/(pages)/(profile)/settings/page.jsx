"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Save, XIcon, Instagram, Facebook, Twitter } from "lucide-react";
import Loading from "@/src/components/Loading";
import { updateCurrentUser } from "@/src/services/User";
import { useUserStore } from "@/src/store/useUserStore";
import { useUser } from "@/src/context/userProvider";
//TODO ADRESLERİ GÖNERİRKEN BUNDA NASILKİ USERDATA DİYE GÖNDERİYORUM ADRESSDATA DİYE GÖNDERECEĞİM !!!!!!!!!!!!!!!BİTMEDİ
function Settings() {
    const { user: userContext } = useUser(); // Real user data from context
    const { setUser: setUserInContext } = useUser();
    const {
        user: userState,
        setUser: setUserToStore,
        updateUserField,
    } = useUserStore();

    const [isEditing, setIsEditing] = useState(false);
    const [addressState, setAddressState] = useState({
        country: "",
        city: "",
        state: "",
        neighborhood: "",
    });

    useEffect(() => {
        if (userContext) {
            setUserToStore(userContext);
            if (Array.isArray(userContext.location) && userContext.location.length > 0) {
                setAddressState({
                    ...userContext.location[0],
                });
            }
        }
    }, []);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setUserToStore(userContext); // Revert changes
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateUserField(name, value);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSocialLinkChange = (e, platform) => {
        const value = e.target.value;
        const updatedLinks = userState.social_links ? [...userState.social_links] : [];

        const index = updatedLinks.findIndex((link) => link.platform === platform);

        if (index !== -1) {
            updatedLinks[index].url = value;
        } else {
            updatedLinks.push({ platform, url: value });
        }

        updateUserField("social_links", updatedLinks);
    };

    const getSocialLink = (platform) => {
        const links = userState?.social_links || [];
        const link = links.find((l) => l.platform === platform);
        return link ? link.url : "";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsEditing(false);

        const updatedPayload = {
            ...userState,
            location: addressState._id || userState.location?._id || null,
        };

        console.log("updatedPayload", updatedPayload);
        const response = await updateCurrentUser(updatedPayload);

        if (response.success) {
            const updatedUser = response.data.updatedUser;
            setUserToStore(updatedUser);
            setUserInContext(updatedUser);
        } else {
            console.error("Error updating user:", response.statusText);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    if (!userState) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <form
                onSubmit={handleSave}
                className="space-y-8 bg-white p-8 rounded-lg shadow-lg"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-700">Ayarlar</h2>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            type="button"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            <Pencil size={18} /> Düzenle
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: "Ad", name: "name" },
                        { label: "Soyad", name: "surname" },
                        { label: "Kullanıcı Adı", name: "userName" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Telefon", name: "phoneNumber" },
                        { label: "Doğum Tarihi", name: "birthdate", type: "date" },
                    ].map(({ label, name, type = "text" }) => (
                        <div key={name}>
                            <label className="block mb-2 font-medium">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={name === "birthdate"
                                    ? formatDate(userState[name])
                                    : userState[name] || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    ))}

                    {/* Address Fields */}
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold">Adres Bilgileri</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Ülke", name: "country" },
                                { label: "Şehir", name: "city" },
                                { label: "Eyalet", name: "state" },
                                { label: "Mahalle", name: "neighborhood" },
                            ].map(({ label, name }) => (
                                <div key={name}>
                                    <label className="block mb-2 font-medium">{label}</label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={addressState[name] || ""}
                                        onChange={handleAddressChange}
                                        disabled={!isEditing}
                                        className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender Select */}
                    <div>
                        <label className="block mb-2 font-medium">Cinsiyet</label>
                        <select
                            name="gender"
                            value={userState.gender || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                        >
                            <option value="" disabled>Cinsiyet Seçin</option>
                            <option value="male">Erkek</option>
                            <option value="female">Kadın</option>
                            <option value="non-binary">Non-binary</option>
                        </select>
                    </div>

                    {/* Job */}
                    <div>
                        <label className="block mb-2 font-medium">İş</label>
                        <input
                            type="text"
                            name="job"
                            value={userState.job || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                        />
                    </div>
                </div>

                {/* Biography */}
                <div>
                    <label className="block mb-2 font-medium">Biyografi</label>
                    <textarea
                        name="bio"
                        value={userState.bio || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full border rounded-md p-2 h-28 resize-none ${!isEditing ? "bg-gray-100" : ""}`}
                    />
                </div>

                {/* Social Media Links */}
                <div>
                    <label className="block mb-4 text-xl font-semibold text-gray-700">
                        Sosyal Medya Linkleri
                    </label>
                    <div className="space-y-4">
                        {[
                            { platform: "instagram", icon: <Instagram className="text-pink-600" /> },
                            { platform: "facebook", icon: <Facebook className="text-blue-600" /> },
                            { platform: "x", icon: <Twitter className="text-blue-400" /> },
                        ].map(({ platform, icon }) => (
                            <div className="flex items-center gap-4 mb-2" key={platform}>
                                {icon}
                                <input
                                    type="text"
                                    value={getSocialLink(platform)}
                                    onChange={(e) => handleSocialLinkChange(e, platform)}
                                    placeholder={`${platform} Linki`}
                                    disabled={!isEditing}
                                    className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 flex justify-center items-center gap-2 px-4 py-2 rounded-lg"
                        >
                            <XIcon size={18} /> İptal
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                        >
                            <Save size={18} /> Kaydet
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Settings;

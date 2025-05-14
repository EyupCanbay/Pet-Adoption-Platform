"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Save, XIcon, Instagram, Facebook, Twitter, Router } from "lucide-react";
import Loading from "@/src/components/Loading";
import { updateCurrentUser } from "@/src/services/User";
import { useUserStore } from "@/src/store/useUserStore";
import { useUser } from "@/src/context/userProvider";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
function Settings() {
    const router = useRouter();
    const { user: userContext } = useUser();
    const { setInitialUser: setUserInContext } = useUser();
    const {
        user: userState,
        setUser: setUserToStore,
        location: userLocation,
        setLocation: setUserLocation,
        updateUserField,
    } = useUserStore();

    const [loading, setLoading] = useState(true);
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
            const locationData = userContext?.data?.location?.[0];
            if (locationData) {
                setAddressState(locationData);
            }
            setLoading(false);
        }
    }, []);

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setIsEditing(false);
        setUserToStore(userContext); // revert user fields
        const locationData = userContext?.data?.location?.[0];
        if (locationData) {
            setAddressState(locationData); // revert address
        }
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
        const updatedLinks = userState?.data?.user.social_links ? [...userState?.data?.user.social_links] : [];

        const index = updatedLinks.findIndex((link) => link.platform === platform);

        if (index !== -1) {
            updatedLinks[index].url = value;
        } else {
            updatedLinks.push({ platform, url: value });
        }

        updateUserField("social_links", updatedLinks);
    };

    const getSocialLink = (platform) => {
        const links = userState?.data?.user?.social_links || [];
        const link = links.find((l) => l.platform === platform);
        return link ? link.url : "";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsEditing(false);

        const updatedPayload = {
            userData: {
                ...userState?.data?.user,
            },
            addressData: {
                ...addressState,
            },
        };

        try {
            const response = await updateCurrentUser(updatedPayload);

            if (response.success) {
                const updatedUser = response.data.updatedUser;
                setUserToStore(updatedUser);
                setUserInContext(updatedUser);
                setLoading(false);
                router.push("/profile");
            } else {
                console.error("Kullanıcı güncelleme hatası:", response.statusText);
            }
        } catch (err) {
            console.error("Beklenmeyen hata:", err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-700">Ayarlar</h2>
                    <div className="flex gap-4">
                        <Button
                            variant="outlined"
                            className="flex items-center cursor-pointer gap-2 hover:bg-gray-100"
                            onClick={() => router.push = "/"}
                        >
                            Ana Sayfaya Dön
                        </Button>
                        {!isEditing && (
                            <Button
                                variant="outlined"
                                className="flex items-center cursor-pointer gap-2 hover:bg-blue-100"
                                onClick={handleEdit}
                                color="blue"
                            >
                                <Pencil size={18} /> Düzenle
                            </Button>
                        )}

                    </div>
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
                                    ? formatDate(userState?.data?.user[name])
                                    : userState?.data?.user[name] || ""}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    ))}

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

                    <div>
                        <label className="block mb-2 font-medium">Cinsiyet</label>
                        <select
                            name="gender"
                            value={userState?.data?.user.gender || ""}
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

                    <div>
                        <label className="block mb-2 font-medium">İş</label>
                        <input
                            type="text"
                            name="job"
                            value={userState?.data?.user.job || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className={`w-full border rounded-md p-2 ${!isEditing ? "bg-gray-100" : ""}`}
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Biyografi</label>
                    <textarea
                        name="bio"
                        value={userState?.data?.user.bio || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full border rounded-md p-2 h-28 resize-none ${!isEditing ? "bg-gray-100" : ""}`}
                    />
                </div>

                <div>
                    <label className="block mb-4 text-xl font-semibold text-gray-700">Sosyal Medya Linkleri</label>
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

                {isEditing && (
                    <div className="flex gap-4 mt-6">
                        <Button
                            variant="outlined"
                            className="flex items-center cursor-pointer gap-2 hover:bg-red-100"
                            onClick={handleCancel}
                            color="red"
                        >
                            <XIcon size={18} onClick={handleCancel} /> İptal
                        </Button>
                        <Button
                            variant="outlined"
                            className="flex items-center  cursor-pointer gap-2 hover:bg-green-100"
                            onClick={handleSave}
                            type="submit"
                            color="green"
                        >
                            <Save size={18} /> Kaydet
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default Settings;

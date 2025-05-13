"use client";

import { useLostListingStore } from "@/src/store/useLostListingStore";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { createLostListing } from "@/src/services/LostListings";
import { useUser } from "@/src/context/userProvider";

export default function LostListing() {
    const { user } = useUser();
    const {
        lostListing,
        updateLostListingField,
        updateLostAdditionalInfoField,
    } = useLostListingStore();

    const handleChange = (field, value) => updateLostListingField(field, value);
    const handleAdditionalChange = (field, value) =>
        updateLostAdditionalInfoField(field, value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                ...lostListing,
                additionalInfo: {
                    ...lostListing.additionalInfo,
                },
            };

            const response = await createLostListing(formData);
        } catch (error) {
            console.error("Error creating lost listing:", error);
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto p-6 space-y-6 bg-white"
        >
            {/* Ana Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Hayvan Adı</label>
                    <input
                        type="text"
                        value={lostListing.petName || ""}
                        onChange={(e) => handleChange("petName", e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Yaş</label>
                    <input
                        min="0"
                        type="number"
                        value={lostListing.age ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            handleChange("age", value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Cinsiyet</label>
                    <select
                        value={lostListing.gender ? "Erkek" : "Dişi"}
                        onChange={(e) => handleChange("gender", e.target.value === "Erkek")}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    >
                        <option>Erkek</option>
                        <option>Dişi</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Kategori</label>
                    <input
                        type="text"
                        value={lostListing.category_name || ""}
                        onChange={(e) => handleChange("category_name", e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Alt Kategori</label>
                    <input
                        type="text"
                        value={lostListing.sub_category_name || ""}
                        onChange={(e) => handleChange("sub_category_name", e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Resimler (virgülle ayır)</label>
                    <input
                        type="text"
                        value={lostListing.images?.join(",") || ""}
                        onChange={(e) => handleChange("images", e.target.value.split(","))}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Açıklama */}
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                    value={lostListing.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Ek Bilgiler */}
            <h3 className="text-xl font-semibold text-blue-700">Ek Bilgiler</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Renk" value={lostListing.additionalInfo?.color} onChange={(val) => handleAdditionalChange("color", val)} />
                <InputField label="Göz Rengi" value={lostListing.additionalInfo?.eyeColor} onChange={(val) => handleAdditionalChange("eyeColor", val)} />
                <InputField label="Tüy Tipi" value={lostListing.additionalInfo?.furType} onChange={(val) => handleAdditionalChange("furType", val)} />

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Ebat</label>
                    <select
                        value={lostListing.additionalInfo?.size || ""}
                        onChange={(e) => handleAdditionalChange("size", e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    >
                        <option>small</option>
                        <option>medium</option>
                        <option>large</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Ağırlık (kg)</label>
                    <input
                        min="0"
                        type="number"
                        value={lostListing.additionalInfo?.weight ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : parseFloat(e.target.value);
                            handleAdditionalChange("weight", value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <input
                        type="checkbox"
                        checked={lostListing.additionalInfo?.vaccinated || false}
                        onChange={(e) => handleAdditionalChange("vaccinated", e.target.checked)}
                        id="vaccinated"
                        className="h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="vaccinated" className="text-sm text-gray-700">Aşılı</label>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Eğitilebilirlik</label>
                    <select
                        value={lostListing.additionalInfo?.trainability ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : e.target.value;
                            handleAdditionalChange("trainability", value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="" disabled>Seçiniz</option>
                        <option value="easy">easy</option>
                        <option value="medium">medium</option>
                        <option value="hard">hard</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Sosyallik</label>
                    <select
                        value={lostListing.additionalInfo?.sociality ?? ""}
                        onChange={(e) => {
                            const value = e.target.value === "" ? null : e.target.value;
                            handleAdditionalChange("sociality", value);
                        }}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="" disabled>Seçiniz</option>
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                    </select>
                </div>

            </div>

            {/* Slider */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Oyunculuk (1-5)</label>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={lostListing.additionalInfo?.playfulness || 1}
                    onChange={(e) => handleAdditionalChange("playfulness", parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
                <Button
                    variant="outlined"
                    type="submit"
                    color="blue"
                    className="font-semibold cursor-pointer hover:bg-blue-400 hover:text-white rounded-md shadow-md transition duration-200"
                    onClick={handleSubmit}
                >
                    Kaydet
                </Button>
            </div>
        </form>
    );
}

// Reusable InputField component
function InputField({ label, value, onChange }) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
}

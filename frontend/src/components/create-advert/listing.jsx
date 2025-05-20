"use client";

import { useListingStore } from "@/src/store/useListingStore";
import { useUser } from "@/src/context/userProvider";
import { Button } from "@material-tailwind/react";
import { createListing } from "@/src/services/Listings";

export default function Listing() {
    const { user } = useUser();
    const {
        listing,
        updateListingField,
        updateAdditionalInfoField,
    } = useListingStore();

    const handleChange = (field, value) => updateListingField(field, value);
    const handleAdditionalChange = (field, value) =>
        updateAdditionalInfoField(field, value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...listing,
                additionalInfo: {
                    ...listing.additionalInfo,
                },
            };

            const response = await createListing(formData);
        } catch (error) {
            console.error("Error creating listing:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6 bg-white">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Hayvan Adı" value={listing.petName} onChange={(val) => handleChange("petName", val)} />
                <InputField label="Yaş" type="number" value={listing.age} onChange={(val) => handleChange("age", parseInt(val))} />
                <SelectField label="Cinsiyet" value={listing.gender ? "Erkek" : "Dişi"} onChange={(val) => handleChange("gender", val === "Erkek")} options={["Erkek", "Dişi"]} />
                <InputField label="Kategori" value={listing.category_name} onChange={(val) => handleChange("category_name", val)} />
                <InputField label="Alt Kategori" value={listing.sub_category_name} onChange={(val) => handleChange("sub_category_name", val)} />
                <InputField label="Resimler (virgülle ayır)" value={listing.images?.join(",")} onChange={(val) => handleChange("images", val.split(","))} />
            </div>

            {/* Açıklama */}
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                    value={listing.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Ek Bilgiler */}
            <h3 className="text-xl font-semibold text-blue-700">Ek Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Renk" value={listing.additionalInfo.color} onChange={(val) => handleAdditionalChange("color", val)} />
                <InputField label="Göz Rengi" value={listing.additionalInfo.eyeColor} onChange={(val) => handleAdditionalChange("eyeColor", val)} />
                <InputField label="Tüy Tipi" value={listing.additionalInfo.furType} onChange={(val) => handleAdditionalChange("furType", val)} />
                <SelectField label="Ebat" value={listing.additionalInfo.size} onChange={(val) => handleAdditionalChange("size", val)} options={["small", "medium", "large"]} />
                <InputField label="Ağırlık (kg)" type="number" value={listing.additionalInfo.weight} onChange={(val) => handleAdditionalChange("weight", parseFloat(val))} />

                <CheckboxField label="Aşılı" checked={listing.additionalInfo.vaccinated} onChange={(val) => handleAdditionalChange("vaccinated", val)} />
                <InputField label="Aşı Tarihi" type="date" value={listing.additionalInfo.vaccinated_last_date ?? ""} onChange={(val) => handleAdditionalChange("vaccinated_last_date", val)} />

                <CheckboxField label="Kısırlaştırılmış" checked={listing.additionalInfo.neutered} onChange={(val) => handleAdditionalChange("neutered", val)} />

                <SelectField label="Eğitilebilirlik" value={listing.additionalInfo.trainability} onChange={(val) => handleAdditionalChange("trainability", val)} options={["easy", "medium", "hard"]} />
                <SelectField label="Sosyallik" value={listing.additionalInfo.sociality} onChange={(val) => handleAdditionalChange("sociality", val)} options={["low", "medium", "high"]} />
            </div>

            {/* Oyunculuk */}
            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Oyunculuk (1-5)</label>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={listing.additionalInfo.playfulness}
                    onChange={(e) => handleAdditionalChange("playfulness", parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>

            {/* Gönder */}
            <div className="flex justify-end pt-4">
                <Button
                    variant="outlined"
                    type="submit"
                    color="blue"
                    className="font-semibold cursor-pointer hover:bg-blue-400 hover:text-white rounded-md shadow-md transition duration-200"
                >
                    Kaydet
                </Button>
            </div>
        </form>
    );
}

// Reusable Components
function InputField({ label, value, onChange, type = "text" }) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options }) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
}

function CheckboxField({ label, checked, onChange }) {
    return (
        <div className="flex items-center gap-3 mt-2">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                id={label}
                className="h-5 w-5 text-blue-600"
            />
            <label htmlFor={label} className="text-sm text-gray-700">{label}</label>
        </div>
    );
}

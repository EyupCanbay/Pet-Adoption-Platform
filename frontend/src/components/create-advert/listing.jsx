// src/components/create-advert/listing.jsx

"use client";

import { useListingStore } from "@/src/store/useListingStore";
import { useUser } from "@/src/context/userProvider";
import { Button } from "@material-tailwind/react";
import { createListing } from "@/src/services/Listings";
import { getAllCategories } from "@/src/services/Category";
import { useEffect, useState } from "react";
import { getAllSubCategories } from "@/src/services/SubCategory";
import { useRouter } from "next/navigation";

export default function Listing() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const { user } = useUser();
    const router = useRouter();
    const {
        listing,
        updateListingField,
        updateAdditionalInfoField,
    } = useListingStore();

    const { additionalInfo = {} } = listing;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        const fetchSubCategories = async () => {
            try {
                const response = await getAllSubCategories();
                setSubCategories(response.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };
        fetchSubCategories();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (listing.category_name && categories.length > 0 && subCategories.length > 0) {
            const selectedCategory = categories.find(
                (cat) => cat.name === listing.category_name
            );
            if (selectedCategory) {
                const newFilteredSubCategories = subCategories.filter(
                    (subCat) => subCat.category_id === selectedCategory._id
                );
                setFilteredSubCategories(newFilteredSubCategories);
                if (!newFilteredSubCategories.some(subCat => subCat.name === listing.sub_category_name)) {
                    updateListingField("sub_category_name", "");
                }
            } else {
                setFilteredSubCategories([]);
                updateListingField("sub_category_name", "");
            }
        } else {
            setFilteredSubCategories([]);
            updateListingField("sub_category_name", "");
        }
    }, [listing.category_name, categories, subCategories, updateListingField]);

    const handleChange = (field, value) => updateListingField(field, value);
    const handleAdditionalChange = (field, value) =>
        updateAdditionalInfoField(field, value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                ...listing,
                owner_id: user._id,
                additionalInfo: {
                    ...additionalInfo, 
                },
            };

            const response = await createListing(formData);
            if (response.success) {
                router.push("/");
                useListingStore.setState({ listing: {} });
            }

        } catch (error) {
            console.error("Error creating listing:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Hayvan Adı" value={listing.petName} onChange={(val) => handleChange("petName", val)} />
                <InputField
                    label="Yaş"
                    type="number"
                    value={listing.age ?? ""}
                    onChange={(val) => handleChange("age", val === "" ? null : parseInt(val))}
                />
                <SelectField label="Cinsiyet" value={listing.gender ? "Erkek" : "Dişi"} onChange={(val) => handleChange("gender", val === "Erkek")} options={["Erkek", "Dişi"]} />

                <SelectField
                    label="Kategori"
                    value={listing.category_name}
                    onChange={(val) => handleChange("category_name", val)}
                    options={categories.map((cat) => ({ label: cat.name, value: cat.name, _id: cat._id }))}
                />

                <SelectField
                    label="Alt Kategori"
                    value={listing.sub_category_name}
                    onChange={(val) => handleChange("sub_category_name", val)}
                    options={filteredSubCategories.map((subCat) => ({ label: subCat.breed, value: subCat.breed, _id: subCat._id }))}
                    disabled={!listing.category_name}
                />
                <InputField label="Resimler (virgülle ayır)" value={listing.images?.join(",")} onChange={(val) => handleChange("images", val.split(","))} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                    value={listing.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <h3 className="text-xl font-semibold text-blue-700">Ek Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Renk" value={additionalInfo.color} onChange={(val) => handleAdditionalChange("color", val)} />
                <InputField label="Göz Rengi" value={additionalInfo.eyeColor} onChange={(val) => handleAdditionalChange("eyeColor", val)} />
                <InputField label="Tüy Tipi" value={additionalInfo.furType} onChange={(val) => handleAdditionalChange("furType", val)} />
                <SelectField
                    label="Ebat"
                    value={additionalInfo.size}
                    onChange={(val) => handleAdditionalChange("size", val)}
                    options={[
                        { label: "Küçük", value: "small" },
                        { label: "Orta", value: "medium" },
                        { label: "Büyük", value: "large" },
                    ]}
                />
                <InputField label="Ağırlık (kg)" type="number" value={additionalInfo.weight ?? ""} onChange={(val) => handleAdditionalChange("weight", val === "" ? null : parseFloat(val))} />

                <CheckboxField label="Aşılı" checked={additionalInfo.vaccinated || false} onChange={(val) => handleAdditionalChange("vaccinated", val)} />
                <InputField label="Aşı Tarihi" type="date" value={additionalInfo.vaccinated_last_date ?? ""} onChange={(val) => handleAdditionalChange("vaccinated_last_date", val)} />

                <CheckboxField label="Kısırlaştırılmış" checked={additionalInfo.neutered || false} onChange={(val) => handleAdditionalChange("neutered", val)} />

                <SelectField label="Eğitilebilirlik" value={additionalInfo.trainability} onChange={(val) => handleAdditionalChange("trainability", val)} options={[
                    { label: "Kolay", value: "easy" },
                    { label: "Orta", value: "medium" },
                    { label: "Zor", value: "hard" },
                ]} />
                <SelectField label="Sosyallik" value={additionalInfo.sociality} onChange={(val) => handleAdditionalChange("sociality", val)} options={[
                    { label: "Düşük", value: "low" },
                    { label: "Orta", value: "medium" },
                    { label: "Yüksek", value: "high" },
                ]} />
            </div>

            <div className="mt-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Oyunculuk (1-5)</label>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={additionalInfo.playfulness || 1}
                    onChange={(e) => handleAdditionalChange("playfulness", parseInt(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>

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

function SelectField({ label, value, onChange, options, disabled = false }) {
    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                disabled={disabled}
            >
                <option value="">Seçiniz...</option>
                {options.map((opt) => {
                    const optionValue = typeof opt === 'object' && opt !== null && opt.hasOwnProperty('value')
                        ? opt.value
                        : opt;

                    const optionLabel = typeof opt === 'object' && opt !== null && opt.hasOwnProperty('label')
                        ? opt.label
                        : opt;

                    const optionKey = typeof opt === 'object' && opt !== null && opt.hasOwnProperty('_id')
                        ? opt._id
                        : optionValue;

                    return (
                        <option key={optionKey} value={optionValue}>
                            {optionLabel}
                        </option>
                    );
                })}
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

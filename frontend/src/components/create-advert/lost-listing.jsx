"use client";

import { useLostListingStore } from "@/src/store/useLostListingStore";
import { Button } from "@material-tailwind/react";
import { useState, useEffect } from "react"; 
import { createLostListing } from "@/src/services/LostListings";
import { useUser } from "@/src/context/userProvider";
import { getAllCategories } from "@/src/services/Category"; 
import { getAllSubCategories } from "@/src/services/SubCategory"; 
import { useRouter } from "next/navigation"; 

export default function LostListing() {
    const { user } = useUser();
    const router = useRouter(); 
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]); 

    const {
        lostListing,
        updateLostListingField,
        updateLostAdditionalInfoField,
    } = useLostListingStore();

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
        if (lostListing.category_name && categories.length > 0 && subCategories.length > 0) {
            const selectedCategory = categories.find(
                (cat) => cat.name === lostListing.category_name
            );
            if (selectedCategory) {
                const newFilteredSubCategories = subCategories.filter(
                    (subCat) => subCat.category_id === selectedCategory._id
                );
                setFilteredSubCategories(newFilteredSubCategories);
                if (!newFilteredSubCategories.some(subCat => subCat.breed === lostListing.sub_category_name)) {
                    updateLostListingField("sub_category_name", "");
                }
            } else {
                setFilteredSubCategories([]);
                updateLostListingField("sub_category_name", "");
            }
        } else {
            setFilteredSubCategories([]);
            updateLostListingField("sub_category_name", "");
        }
    }, [lostListing.category_name, categories, subCategories, updateLostListingField]);


    const handleChange = (field, value) => updateLostListingField(field, value);
    const handleAdditionalChange = (field, value) =>
        updateLostAdditionalInfoField(field, value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = {
                ...lostListing,
                owner_id: user._id,
                additionalInfo: {
                    ...lostListing.additionalInfo,
                },
            };

            const response = await createLostListing(formData);
            console.log("Lost listing created:", response);
        } catch (error) {
            console.error("Error creating lost listing:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto p-6 space-y-6 bg-white"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Hayvan Adı"
                    value={lostListing.petName}
                    onChange={(val) => handleChange("petName", val)}
                />
                <InputField
                    label="Yaş"
                    type="number"
                    value={lostListing.age}
                    onChange={(val) => handleChange("age", parseInt(val))}
                />

                <SelectField
                    label="Cinsiyet"
                    value={lostListing.gender ? "Erkek" : "Dişi"}
                    onChange={(val) => handleChange("gender", val === "Erkek")}
                    options={["Erkek", "Dişi"]}
                />

                <SelectField
                    label="Kategori"
                    value={lostListing.category_name}
                    onChange={(val) => handleChange("category_name", val)}
                    options={categories.map((cat) => ({ label: cat.name, value: cat.name, _id: cat._id }))}
                />

                <SelectField
                    label="Alt Kategori"
                    value={lostListing.sub_category_name}
                    onChange={(val) => handleChange("sub_category_name", val)}
                    options={filteredSubCategories.map((subCat) => ({ label: subCat.breed, value: subCat.breed, _id: subCat._id }))}
                    disabled={!lostListing.category_name} 
                />

                <InputField
                    label="Resimler (virgülle ayır)"
                    value={lostListing.images?.join(",")}
                    onChange={(val) => handleChange("images", val.split(","))}
                />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Açıklama</label>
                <textarea
                    value={lostListing.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <h3 className="text-xl font-semibold text-blue-700">Ek Bilgiler</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Renk" value={lostListing.additionalInfo?.color} onChange={(val) => handleAdditionalChange("color", val)} />
                <InputField label="Göz Rengi" value={lostListing.additionalInfo?.eyeColor} onChange={(val) => handleAdditionalChange("eyeColor", val)} />
                <InputField label="Tüy Tipi" value={lostListing.additionalInfo?.furType} onChange={(val) => handleAdditionalChange("furType", val)} />

                <SelectField
                    label="Ebat"
                    value={lostListing.additionalInfo?.size}
                    onChange={(val) => handleAdditionalChange("size", val)}
                    options={[
                        { label: "Küçük", value: "small" },
                        { label: "Orta", value: "medium" },
                        { label: "Büyük", value: "large" },
                    ]}
                />

                <InputField
                    label="Ağırlık (kg)"
                    type="number"
                    value={lostListing.additionalInfo?.weight}
                    onChange={(val) => handleAdditionalChange("weight", parseFloat(val))}
                />

                <CheckboxField
                    label="Aşılı"
                    checked={lostListing.additionalInfo?.vaccinated || false}
                    onChange={(val) => handleAdditionalChange("vaccinated", val)}
                />

                <SelectField
                    label="Eğitilebilirlik"
                    value={lostListing.additionalInfo?.trainability}
                    onChange={(val) => handleAdditionalChange("trainability", val)}
                    options={[
                        { label: "Kolay", value: "easy" },
                        { label: "Orta", value: "medium" },
                        { label: "Zor", value: "hard" },
                    ]}
                />

                <SelectField
                    label="Sosyallik"
                    value={lostListing.additionalInfo?.sociality}
                    onChange={(val) => handleAdditionalChange("sociality", val)}
                    options={[
                        { label: "Düşük", value: "low" },
                        { label: "Orta", value: "medium" },
                        { label: "Yüksek", value: "high" },
                    ]}
                />
            </div>

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

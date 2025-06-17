"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Checkbox,
    Typography,
    Card,
    CardBody,
} from "@material-tailwind/react";
import {
    getAllSubCategories,
    deleteSubCategory,
    updateSubCategory,
    createSubCategoryByCategoryId,
} from "@/src/services/SubCategory";
import { getAllCategories } from "@/src/services/Category";
import Loading from "../Loading";

function AdminSubCategories() {
    const [subCategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        breed: "",
        description: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const categoryData = await getAllCategories();
            setCategories(categoryData?.data || []);
            const subCategoryData = await getAllSubCategories();
            setSubCategories(subCategoryData?.data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleCategoryChange = (id) => {
        setSelectedCategory(id === selectedCategory ? null : id);
        setErrorMessage("");
    };

    const confirmDelete = (id) => {
        setDeleteTargetId(id);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        await deleteSubCategory(deleteTargetId);
        setSubCategories((prev) =>
            prev.filter((item) => item._id !== deleteTargetId)
        );
        setDeleteConfirmOpen(false);
    };

    const handleEdit = (subCat) => {
        setIsEditing(true);
        setFormData({
            breed: subCat.breed,
            description: subCat.description,
        });
        setEditingId(subCat._id);
        setOpenModal(true);
    };

    const handleAddNew = () => {
        setIsEditing(false);
        setFormData({ breed: "", description: "" });
        setEditingId(null);
        setOpenModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing && editingId) {
                await updateSubCategory(editingId, formData);
                setSubCategories((prev) =>
                    prev.map((item) =>
                        item._id === editingId ? { ...item, ...formData } : item
                    )
                );
            } else {
                const newSub = await createSubCategoryByCategoryId(
                    selectedCategory,
                    formData
                );
                setSubCategories((prev) => [...prev, newSub.data]);
            }
            setOpenModal(false);
            setFormData({ breed: "", description: "" });
            setEditingId(null);
        } catch (err) {
            console.error("Hata:", err);
        }
    };

    const filteredSubCategories = selectedCategory
        ? subCategories.filter((sub) => sub.category_id === selectedCategory)
        : subCategories;

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="p-6 space-y-6">
                    <Typography variant="h4">Alt Kategoriler</Typography>

                    {errorMessage && (
                        <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-md shadow-md w-fit mt-2">
                            {errorMessage}
                        </div>
                    )
                    }

                    <div className="flex gap-4 flex-wrap">
                        {categories.map((cat) => (
                            <div className="flex flex-col items-center" key={cat._id}>
                                <Checkbox
                                    checked={selectedCategory === cat._id}
                                    onChange={() => handleCategoryChange(cat._id)}
                                />
                                <label className="text-sm text-white">
                                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="outlined"
                            className="cursor-pointer border-blue-500 text-white hover:bg-blue-500"
                            onClick={() => {
                                if (!selectedCategory) {
                                    setErrorMessage("Lütfen önce bir kategori seçin.");
                                    return;
                                }
                                setErrorMessage("");
                                handleAddNew();
                            }}
                        >
                            Yeni Alt Kategori Ekle
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredSubCategories.map((sub) => (
                            <Card key={sub._id} className="shadow-md bg-inherit text-white border border-gray-700">
                                <CardBody>
                                    <Typography variant="h6">{sub.breed}</Typography>
                                    <Typography className="text-sm text-gray-500">
                                        {sub.description}
                                    </Typography>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            className="cursor-pointer border-green-600 text-white hover:bg-green-500"
                                            onClick={() => handleEdit(sub)}
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="red"
                                            className="cursor-pointer text-white hover:bg-red-500"
                                            onClick={() => confirmDelete(sub._id)}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {
                        openModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur z-50">
                                <div className="border border-gray-300 rounded-lg shadow-lg w-full max-w-md p-6 space-y-4 text-black">
                                    <h3 className="text-xl text-white font-semibold">
                                        {isEditing ? "Alt Kategori Düzenle" : "Yeni Alt Kategori Ekle"}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-white font-medium mb-1">Irk (breed)</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 text-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                                                value={formData.breed}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, breed: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white font-medium mb-1">Açıklama</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-3 text-white py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            variant="outlined"
                                            className="border-gray-300 cursor-pointer text-white hover:bg-gray-200 hover:text-gray-700"
                                            onClick={() => setOpenModal(false)}
                                        >
                                            İptal
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="border-blue-500 cursor-pointer text-white hover:bg-blue-500"
                                            onClick={handleSave}
                                            disabled={!formData.breed || !formData.description}
                                        >
                                            {isEditing ? "Kaydet" : "Ekle"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        deleteConfirmOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black space-y-4">
                                    <h3 className="text-xl font-semibold">Alt kategoriyi silmek istediğinize emin misiniz?</h3>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            variant="outlined"
                                            className="border-gray-300 text-gray-700 hover:bg-gray-200"
                                            onClick={() => setDeleteConfirmOpen(false)}
                                        >
                                            Vazgeç
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="red"
                                            className="text-white border-red-500 bg-red-600 hover:bg-red-700"
                                            onClick={handleConfirmDelete}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            )}
        </>
    );
}

export default AdminSubCategories;

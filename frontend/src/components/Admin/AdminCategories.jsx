import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "@/src/services/Category";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Yeni: Silme onay modalı için state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      setCategories(data.data);
    } catch (err) {
      setError("Kategori getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingId(category._id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("İsim boş olamaz.");
      return;
    }
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      console.error("Kategori işlemi hatası:", err);
      alert("İşlem gerçekleştirilemedi: " + (err.message || err));
    }
  };

  // Yeni: Silme onay modalını açan fonksiyon
  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  // Yeni: Silme işlemini onayla
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteCategory(confirmDeleteId);
      setConfirmDeleteId(null);
      fetchCategories();
    } catch {
      alert("Kategori silinemedi.");
    }
  };

  // Yeni: Silme iptal
  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Typography variant="h4" className="mb-6">
        Kategori Yönetimi
      </Typography>
      <Button
        color="orange"
        variant="outlined"
        onClick={openCreateModal}
        className="mb-4 hover:bg-orange-500 hover:text-white cursor-pointer"
      >
        Yeni Kategori Ekle
      </Button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && categories.length === 0 && <p>Kategori bulunamadı.</p>}

      <ul>
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="border p-4 mb-2 flex justify-between items-center rounded-md"
          >
            <div>
              <Typography variant="h5">
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </Typography>

              <Typography variant="small" className="text-gray-500">
                Açıklama: {cat.description}
              </Typography>
              <Typography variant="small" className="text-gray-500">
                Oluşturan: {cat.created_by}
              </Typography>
            </div>
            <div>
              <Button
                variant="outlined"
                color="green"
                size="sm"
                className="mr-2 cursor-pointer hover:text-white hover:bg-green-500"
                onClick={() => openEditModal(cat)}
              >
                Düzenle
              </Button>
              <Button
                variant="outlined"
                color="red"
                className="cursor-pointer hover:text-white hover:bg-red-500"
                size="sm"
                onClick={() => handleDeleteClick(cat._id)}
              >
                Sil
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* --- Kategori Ekle/Düzenle Modal (Tailwind custom) --- */}
      {modalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>

          {/* Modal box */}
          <div className="fixed z-50 top-1/2 left-1/2 max-w-md w-full rounded shadow-lg p-6 transform -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Kategori Adı"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
              autoFocus
            />
            <input
              type="text"
              name="description"
              placeholder="Açıklama"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <div className="flex justify-end space-x-3">
              <Button
                variant="outlined"
                color="red"
                onClick={closeModal}
                className="cursor-pointer hover:bg-red-500 hover:text-white"
              >
                İptal
              </Button>
              <Button
                variant="outlined"
                color="green"
                onClick={handleSubmit}
                className="cursor-pointer hover:bg-green-500 hover:text-white"
              >
                {editingId ? "Kaydet" : "Ekle"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* --- Silme Onay Modalı (Tailwind custom) --- */}
      {confirmDeleteId && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur z-40"
            onClick={cancelDelete}
          ></div>

          {/* Modal box */}
          <div className="fixed z-50 top-1/2 left-1/2 max-w-sm w-full rounded shadow-lg p-6 transform -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-lg font-semibold mb-4">Silme Onayı</h3>
            <p className="mb-6">Bu kategoriyi silmek istediğinize emin misiniz?</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outlined"
                color="red"
                onClick={cancelDelete}
                className="cursor-pointer hover:bg-red-500 hover:text-white"
              >
                Hayır
              </Button>
              <Button
                variant="outlined"
                color="green"
                onClick={confirmDelete}
                className="cursor-pointer hover:bg-green-500 hover:text-white"
              >
                Evet
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminCategories;

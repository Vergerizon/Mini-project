import { useState, useEffect, useCallback } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "../../services/adminCategoryService";

// ── StatusBadge ────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ── Form modal ─────────────────────────────────────────────────────────────
function CategoryFormModal({ category, categories, onClose, onSuccess }) {
  const isEdit = !!category;
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    parent_id: category?.parent_id || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nama kategori wajib diisi"); return; }
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, parent_id: form.parent_id || null };
      if (isEdit) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan kategori");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {isEdit ? "Edit Kategori" : "Tambah Kategori"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nama *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parent Kategori</label>
            <select
              value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">— Tidak ada (root) —</option>
              {categories
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-900 cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: "#d4f53c" }}
            >
              {loading ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Confirm dialog ─────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel, loading, danger }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">Batal</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-60 ${danger ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"}`}>
            {loading ? "Memproses…" : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // modals
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCategories();
      setCategories(res?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat kategori");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus kategori");
    } finally { setActionLoading(false); }
  };

  const handleToggle = async (cat) => {
    try {
      await toggleCategoryStatus(cat.id);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal toggle status");
    }
  };

  const filtered = categories.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola kategori produk DigiWallet.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kategori…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 cursor-pointer"
            style={{ backgroundColor: "#d4f53c" }}
          >
            + Tambah Kategori
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
          {error}
          <button onClick={load} className="ml-3 underline text-purple-600 cursor-pointer">Coba lagi</button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Deskripsi</th>
                  <th className="px-5 py-3">Parent</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">Tidak ada kategori ditemukan.</td>
                  </tr>
                )}
                {filtered.map((c) => {
                  const parent = categories.find((p) => p.id === c.parent_id);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-mono text-gray-500">{c.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{c.description || "—"}</td>
                      <td className="px-5 py-3 text-gray-600">{parent?.name || "—"}</td>
                      <td className="px-5 py-3"><StatusBadge active={c.is_active} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleToggle(c)}
                            title={c.is_active ? "Nonaktifkan" : "Aktifkan"}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition cursor-pointer"
                          >
                            {c.is_active ? "🔒" : "🔓"}
                          </button>
                          <button
                            onClick={() => { setEditTarget(c); setShowForm(true); }}
                            title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            title="Hapus"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <CategoryFormModal
          category={editTarget}
          categories={categories}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={() => { setShowForm(false); setEditTarget(null); load(); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Kategori"
          message={`Yakin ingin menghapus kategori "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
          danger
        />
      )}
    </div>
  );
}

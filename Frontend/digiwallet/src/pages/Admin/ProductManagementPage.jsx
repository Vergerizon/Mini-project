import { useState, useEffect, useCallback } from "react";
import {
  fetchAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../../services/adminProductService";
import { fetchCategories } from "../../services/adminCategoryService";
import formatRupiah from "../../utils/currency";

const PRODUCT_TYPES = ["pulsa", "data", "pln", "pdam", "internet", "game", "ewallet"];

const TYPE_LABELS = {
  pulsa: "Pulsa",
  data: "Paket Data",
  pln: "Token PLN",
  pdam: "PDAM",
  internet: "Internet",
  game: "Game",
  ewallet: "E-Wallet",
};

function TypeBadge({ type }) {
  const colors = {
    pulsa: "bg-blue-50 text-blue-700",
    data: "bg-indigo-50 text-indigo-700",
    pln: "bg-yellow-50 text-yellow-700",
    pdam: "bg-cyan-50 text-cyan-700",
    internet: "bg-green-50 text-green-700",
    game: "bg-pink-50 text-pink-700",
    ewallet: "bg-purple-50 text-purple-700",
  };
  return (
    <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${colors[type] || "bg-gray-100 text-gray-600"}`}>
      {TYPE_LABELS[type] || type}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-400"}`} />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ── Form modal ─────────────────────────────────────────────────────────────
function ProductFormModal({ product, categories, onClose, onSuccess }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    category_id: product?.category_id || "",
    type: product?.type || PRODUCT_TYPES[0],
    price: product?.price || "",
    description: product?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Nama produk wajib diisi"); return; }
    if (!form.category_id) { setError("Kategori wajib dipilih"); return; }
    if (!form.price || Number(form.price) <= 0) { setError("Harga harus lebih dari 0"); return; }
    setLoading(true);
    setError(null);
    try {
      const payload = { ...form, price: Number(form.price), category_id: Number(form.category_id) };
      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menyimpan produk");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{isEdit ? "Edit Produk" : "Tambah Produk"}</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nama *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kategori *</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="">— Pilih kategori —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipe *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
              {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Harga (Rp) *</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm font-semibold text-gray-900 cursor-pointer disabled:opacity-60" style={{ backgroundColor: "#d4f53c" }}>
              {loading ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // modals
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchAllProducts({ page, limit: 20, type: typeFilter || undefined }),
        fetchCategories(),
      ]);
      setProducts(prodRes?.data ?? []);
      setTotalPages(prodRes?.pagination?.totalPages ?? 1);
      setCategories(catRes?.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat produk");
    } finally { setLoading(false); }
  }, [page, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus produk");
    } finally { setActionLoading(false); }
  };

  const handleToggle = async (prod) => {
    try {
      await toggleProductStatus(prod.id);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal toggle status");
    }
  };

  const filtered = products.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Produk</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola produk PPOB DigiWallet.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Tipe</option>
            {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
          <div className="relative">
            <input type="text" placeholder="Cari produk…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 cursor-pointer"
            style={{ backgroundColor: "#d4f53c" }}
          >
            + Tambah Produk
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-4">
          {error}
          <button onClick={load} className="ml-3 underline text-purple-600 cursor-pointer">Coba lagi</button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-5 py-3">Tipe</th>
                  <th className="px-5 py-3">Kategori</th>
                  <th className="px-5 py-3">Harga</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-gray-400">Tidak ada produk ditemukan.</td></tr>
                )}
                {filtered.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3 font-mono text-gray-500">{p.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-5 py-3"><TypeBadge type={p.type} /></td>
                      <td className="px-5 py-3 text-gray-600">{cat?.name || p.category_id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{formatRupiah(p.price)}</td>
                      <td className="px-5 py-3"><StatusBadge active={p.is_active} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleToggle(p)} title={p.is_active ? "Nonaktifkan" : "Aktifkan"}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition cursor-pointer">
                            {p.is_active ? "🔒" : "🔓"}
                          </button>
                          <button onClick={() => { setEditTarget(p); setShowForm(true); }} title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer">
                            ✏️
                          </button>
                          <button onClick={() => setDeleteTarget(p)} title="Hapus"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer">
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Halaman {page} / {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">← Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editTarget}
          categories={categories}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={() => { setShowForm(false); setEditTarget(null); load(); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Produk"
          message={`Yakin ingin menghapus produk "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
          danger
        />
      )}
    </div>
  );
}

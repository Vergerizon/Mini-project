import { useState, useEffect, useCallback } from "react";
import {
  fetchAllUsers,
  deleteUser,
  changeUserRole,
  topUpUserBalance,
} from "../../services/adminUserService";
import formatRupiah from "../../utils/currency";

// ── helpers ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function RoleBadge({ role }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        isAdmin
          ? "bg-purple-100 text-purple-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isAdmin ? "🛡️" : "👤"} {role}
    </span>
  );
}

// ── TopUp modal ────────────────────────────────────────────────────────────
function TopUpModal({ user, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) { setError("Masukkan jumlah yang valid"); return; }
    setLoading(true);
    setError(null);
    try {
      await topUpUserBalance(user.id, num);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal top up saldo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Top Up Saldo</h3>
        <p className="text-sm text-gray-500 mb-4">
          {user.name} — saldo saat ini: {formatRupiah(user.balance)}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            min="1"
            placeholder="Jumlah top up (Rp)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 mt-1">
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
              {loading ? "Memproses…" : "Top Up"}
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
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white cursor-pointer disabled:opacity-60 ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Memproses…" : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // modals
  const [topUpUser, setTopUpUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllUsers({ page, limit: 20 });
      setUsers(res?.data ?? []);
      setTotalPages(res?.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  // Actions
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus user");
    } finally { setActionLoading(false); }
  };

  const handleRoleChange = async () => {
    setActionLoading(true);
    const newRole = roleTarget.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await changeUserRole(roleTarget.id, newRole);
      setRoleTarget(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal mengubah role");
    } finally { setActionLoading(false); }
  };

  // Filter
  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen User</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola semua pengguna DigiWallet.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
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
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">No. Telepon</th>
                  <th className="px-5 py-3">Saldo</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Terdaftar</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-mono text-gray-500">{u.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3 text-gray-600">{u.phone_number || "—"}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{formatRupiah(u.balance)}</td>
                    <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(u.created_at)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setTopUpUser(u)}
                          title="Top Up Saldo"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition cursor-pointer"
                        >
                          💰
                        </button>
                        <button
                          onClick={() => setRoleTarget(u)}
                          title="Ubah Role"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition cursor-pointer"
                        >
                          🛡️
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          title="Hapus User"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Halaman {page} / {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {topUpUser && (
        <TopUpModal
          user={topUpUser}
          onClose={() => setTopUpUser(null)}
          onSuccess={() => { setTopUpUser(null); load(); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus User"
          message={`Yakin ingin menghapus "${deleteTarget.name}" (${deleteTarget.email})? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
          danger
        />
      )}

      {roleTarget && (
        <ConfirmDialog
          title="Ubah Role"
          message={`Ubah role "${roleTarget.name}" dari ${roleTarget.role} menjadi ${roleTarget.role === "ADMIN" ? "USER" : "ADMIN"}?`}
          onConfirm={handleRoleChange}
          onCancel={() => setRoleTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}

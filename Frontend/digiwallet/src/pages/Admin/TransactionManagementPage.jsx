import { useState, useEffect, useCallback } from "react";
import {
  fetchAllTransactions,
  completeTransaction,
  refundTransaction,
  cancelTransaction,
} from "../../services/adminTransactionService";
import formatRupiah from "../../utils/currency";

// ── helpers ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "Pending" },
  SUCCESS: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400", label: "Berhasil" },
  FAILED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400", label: "Gagal" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", label: "Dibatalkan" },
  REFUNDED: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400", label: "Refund" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
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
export default function TransactionManagementPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  // modals
  const [confirmAction, setConfirmAction] = useState(null); // { type, tx }
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllTransactions({ page, limit: 20, status: statusFilter || undefined });
      setTransactions(res?.data ?? []);
      setTotalPages(res?.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat transaksi");
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      if (confirmAction.type === "complete") await completeTransaction(confirmAction.tx.id);
      else if (confirmAction.type === "refund") await refundTransaction(confirmAction.tx.id);
      else if (confirmAction.type === "cancel") await cancelTransaction(confirmAction.tx.id);
      setConfirmAction(null);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal memproses aksi");
    } finally { setActionLoading(false); }
  };

  const filtered = transactions.filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      tx.reference_number?.toLowerCase().includes(q) ||
      tx.customer_number?.toLowerCase().includes(q) ||
      tx.product_name?.toLowerCase().includes(q) ||
      String(tx.user_id).includes(q)
    );
  });

  const actionLabels = {
    complete: { title: "Selesaikan Transaksi", msg: "Tandai transaksi ini sebagai BERHASIL?", danger: false },
    refund: { title: "Refund Transaksi", msg: "Kembalikan dana transaksi ini ke saldo user?", danger: true },
    cancel: { title: "Batalkan Transaksi", msg: "Batalkan transaksi pending ini?", danger: true },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Transaksi</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola seluruh transaksi pengguna.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Berhasil</option>
            <option value="FAILED">Gagal</option>
            <option value="REFUNDED">Refund</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="Cari ref, no pelanggan…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
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
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Referensi</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3">No. Pelanggan</th>
                  <th className="px-4 py-3">Jumlah</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">Tidak ada transaksi ditemukan.</td></tr>
                )}
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-gray-500">{tx.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{tx.reference_number || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.user_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{tx.product_name || `#${tx.product_id}`}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.customer_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatRupiah(tx.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={tx.status} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(tx.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {tx.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => setConfirmAction({ type: "complete", tx })}
                              title="Selesaikan"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition cursor-pointer"
                            >✅</button>
                            <button
                              onClick={() => setConfirmAction({ type: "cancel", tx })}
                              title="Batalkan"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            >❌</button>
                          </>
                        )}
                        {tx.status === "SUCCESS" && (
                          <button
                            onClick={() => setConfirmAction({ type: "refund", tx })}
                            title="Refund"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          >↩️</button>
                        )}
                        {!["PENDING", "SUCCESS"].includes(tx.status) && (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

      {confirmAction && (
        <ConfirmDialog
          title={actionLabels[confirmAction.type].title}
          message={`${actionLabels[confirmAction.type].msg} (Ref: ${confirmAction.tx.reference_number || confirmAction.tx.id})`}
          onConfirm={handleAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
          danger={actionLabels[confirmAction.type].danger}
        />
      )}
    </div>
  );
}

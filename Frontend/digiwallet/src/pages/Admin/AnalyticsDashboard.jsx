import { useState, useEffect } from "react";
import {
  fetchDashboardReport,
  fetchDailyReport,
  fetchProductReport,
  fetchUserReport,
  fetchFailedTransactions,
} from "../../services/adminReportService";
import formatRupiah from "../../utils/currency";

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${colors[color] || colors.purple}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Tab button ─────────────────────────────────────────────────────────────
function Tab({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
        active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [daily, setDaily] = useState([]);
  const [productReport, setProductReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [failedTxs, setFailedTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchDashboardReport().catch(() => null),
      fetchDailyReport().catch(() => []),
      fetchProductReport().catch(() => []),
      fetchUserReport().catch(() => []),
      fetchFailedTransactions().catch(() => []),
    ])
      .then(([dash, dailyData, prodData, userData, failed]) => {
        setDashboard(dash);
        setDaily(Array.isArray(dailyData) ? dailyData : []);
        setProductReport(Array.isArray(prodData) ? prodData : []);
        setUserReport(Array.isArray(userData) ? userData : []);
        setFailedTxs(Array.isArray(failed) ? failed : []);
      })
      .catch((err) => setError(err?.message || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memuat analitik…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 text-center max-w-sm">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analitik & Laporan</h2>
        <p className="text-sm text-gray-500 mt-1">Ringkasan performa platform DigiWallet.</p>
      </div>

      {/* ── Summary cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={formatRupiah(dashboard?.total_revenue ?? 0)}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Total Transaksi"
          value={dashboard?.total_transactions ?? 0}
          icon="📋"
          color="purple"
        />
        <StatCard
          label="Total Pengguna"
          value={dashboard?.total_users ?? 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          label="Transaksi Gagal"
          value={dashboard?.failed_transactions ?? failedTxs.length}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* ── Quick status overview ─────────────────────────── */}
      {dashboard?.transaction_by_status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {(Array.isArray(dashboard.transaction_by_status) ? dashboard.transaction_by_status : []).map((s) => (
            <div key={s.status} className="bg-white rounded-xl border border-gray-200 px-4 py-3 text-center">
              <p className="text-xs text-gray-500 uppercase">{s.status}</p>
              <p className="text-lg font-bold text-gray-900">{s.count ?? s.total ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab navigation ────────────────────────────────── */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Tab active={tab === "overview"} label="Harian" onClick={() => setTab("overview")} />
        <Tab active={tab === "products"} label="Produk" onClick={() => setTab("products")} />
        <Tab active={tab === "users"} label="Pengguna" onClick={() => setTab("users")} />
        <Tab active={tab === "failed"} label="Gagal" onClick={() => setTab("failed")} />
      </div>

      {/* ── Daily report ──────────────────────────────────── */}
      {tab === "overview" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Transaksi Harian</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Jumlah Transaksi</th>
                  <th className="px-5 py-3">Berhasil</th>
                  <th className="px-5 py-3">Gagal</th>
                  <th className="px-5 py-3">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {daily.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Belum ada data.</td></tr>
                )}
                {daily.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-900 font-medium">{formatDate(d.date || d.transaction_date)}</td>
                    <td className="px-5 py-3 text-gray-600">{d.total_transactions ?? d.count ?? 0}</td>
                    <td className="px-5 py-3 text-green-600 font-medium">{d.successful ?? d.success_count ?? 0}</td>
                    <td className="px-5 py-3 text-red-600 font-medium">{d.failed ?? d.failed_count ?? 0}</td>
                    <td className="px-5 py-3 text-gray-900 font-medium">{formatRupiah(d.total_revenue ?? d.revenue ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Product revenue report ────────────────────────── */}
      {tab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Pendapatan per Produk</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Tipe</th>
                  <th className="px-5 py-3">Total Terjual</th>
                  <th className="px-5 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productReport.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Belum ada data.</td></tr>
                )}
                {productReport.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{p.product_name || p.name}</td>
                    <td className="px-5 py-3 text-gray-600">{p.product_type || p.type || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{p.total_sold ?? p.total_transactions ?? 0}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{formatRupiah(p.total_revenue ?? p.revenue ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── User report ───────────────────────────────────── */}
      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Ringkasan Transaksi per User</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Total Transaksi</th>
                  <th className="px-5 py-3">Total Spending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userReport.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Belum ada data.</td></tr>
                )}
                {userReport.map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{u.user_name || u.name || `User #${u.user_id}`}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{u.total_transactions ?? u.transaction_count ?? 0}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{formatRupiah(u.total_spent ?? u.total_amount ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Failed transactions ───────────────────────────── */}
      {tab === "failed" && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Transaksi Gagal</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Referensi</th>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Produk</th>
                  <th className="px-5 py-3">Jumlah</th>
                  <th className="px-5 py-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {failedTxs.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Tidak ada transaksi gagal. 🎉</td></tr>
                )}
                {failedTxs.map((tx, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-gray-500">{tx.id ?? tx.transaction_id}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{tx.reference_number || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{tx.user_name || tx.user_id || "—"}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{tx.product_name || "—"}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{formatRupiah(tx.amount ?? tx.total_amount ?? 0)}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(tx.created_at ?? tx.transaction_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

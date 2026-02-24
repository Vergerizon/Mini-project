import { useState, useEffect } from "react";
import { fetchProducts } from "../../services/productService";
import formatRupiah from "../../utils/currency";

const TYPE_META = {
  pulsa:    { label: "Pulsa",          icon: "📱", gradient: "linear-gradient(135deg,#7c3aed 0%,#a78bfa 100%)" },
  data:     { label: "Paket Data",     icon: "📶", gradient: "linear-gradient(135deg,#2563eb 0%,#60a5fa 100%)" },
  pln:      { label: "Token PLN",      icon: "⚡", gradient: "linear-gradient(135deg,#d97706 0%,#fbbf24 100%)" },
  pdam:     { label: "PDAM",           icon: "💧", gradient: "linear-gradient(135deg,#0284c7 0%,#38bdf8 100%)" },
  internet: { label: "Internet",       icon: "🌐", gradient: "linear-gradient(135deg,#059669 0%,#34d399 100%)" },
  game:     { label: "Voucher Game",   icon: "🎮", gradient: "linear-gradient(135deg,#dc2626 0%,#f87171 100%)" },
  ewallet:  { label: "E-Wallet",       icon: "💳", gradient: "linear-gradient(135deg,#7c3aed 0%,#c084fc 100%)" },
};

function getTypeMeta(type) {
  return TYPE_META[type] || { label: type, icon: "🛒", gradient: "linear-gradient(135deg,#6b7280 0%,#9ca3af 100%)" };
}

/**
 * ProductCatalog — fetches ALL active products from the backend and shows them
 * grouped by product type. Each card has a "Beli" button.
 */
export default function ProductCatalog({ onSelectProduct, onSelectCategory }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetchProducts({ limit: 100 })
      .then((res) => {
        const list = res?.data ?? res ?? [];
        setProducts(Array.isArray(list) ? list.filter((p) => p.is_active) : []);
      })
      .catch(() => setError("Gagal memuat produk. Silakan refresh halaman."))
      .finally(() => setLoading(false));
  }, []);

  // Unique types that have at least one active product
  const types = ["all", ...Array.from(new Set(products.map((p) => p.type)))];

  const filtered = products.filter((p) => {
    const matchType = activeType === "all" || p.type === activeType;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  // Group by type for display
  const grouped = filtered.reduce((acc, p) => {
    if (!acc[p.type]) acc[p.type] = [];
    acc[p.type].push(p);
    return acc;
  }, {});

  const handleBuy = (product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onSelectCategory) {
      // fallback: open modal by type (legacy)
      onSelectCategory(product.type);
    }
  };

  return (
    <div>
      {/* Header + search */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Layanan &amp; Produk</h2>
          <p className="text-xs text-gray-400 mt-0.5">Pilih produk untuk memulai transaksi</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Type filter tabs */}
      {!loading && !error && types.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {types.map((t) => {
            const meta = t === "all" ? { label: "Semua", icon: "🛍️" } : getTypeMeta(t);
            return (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  activeType === t
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-purple-300"
                }`}
              >
                <span>{meta.icon}</span>
                {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-40">
          <div className="w-7 h-7 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-10 text-center">
          <p className="text-sm text-gray-400">Tidak ada produk ditemukan.</p>
        </div>
      )}

      {/* Products grouped by type */}
      {!loading && !error && Object.entries(grouped).map(([type, items]) => {
        const meta = getTypeMeta(type);
        return (
          <div key={type} className="mb-8">
            {/* Type section header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: meta.gradient }}
              >
                {meta.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{meta.label}</h3>
              <span className="text-xs text-gray-400">({items.length} produk)</span>
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 hover:shadow-md hover:border-purple-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                      style={{ background: meta.gradient, color: "#fff" }}
                    >
                      {meta.icon}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-400">Harga</p>
                      <p className="text-base font-bold text-gray-900">{formatRupiah(product.price)}</p>
                    </div>
                    <button
                      onClick={() => handleBuy(product)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-900 transition hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: "#d4f53c" }}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


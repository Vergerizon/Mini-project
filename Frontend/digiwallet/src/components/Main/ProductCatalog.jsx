import { useState } from "react";

/**
 * ProductCatalog — Codashop-style product category grid.
 * Large cards with icons, descriptions, and a search/filter bar.
 */

const CATEGORIES = [
  {
    key: "pulsa",
    label: "Pulsa",
    desc: "Isi ulang pulsa semua operator",
    icon: "📱",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
  },
  {
    key: "data",
    label: "Paket Data",
    desc: "Kuota internet harga terbaik",
    icon: "📶",
    gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
  },
  {
    key: "pln",
    label: "Token PLN",
    desc: "Token listrik & tagihan PLN",
    icon: "⚡",
    gradient: "linear-gradient(135deg, #d97706 0%, #fbbf24 100%)",
  },
  {
    key: "pdam",
    label: "PDAM",
    desc: "Bayar tagihan air PDAM",
    icon: "💧",
    gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)",
  },
  {
    key: "internet",
    label: "Internet",
    desc: "Bayar langganan WiFi & ISP",
    icon: "🌐",
    gradient: "linear-gradient(135deg, #059669 0%, #34d399 100%)",
  },
  {
    key: "game",
    label: "Voucher Game",
    desc: "Top up game favorit kamu",
    icon: "🎮",
    gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)",
  },
  {
    key: "ewallet",
    label: "E-Wallet",
    desc: "Isi saldo dompet digital",
    icon: "💳",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
  },
];

export default function ProductCatalog({ onSelectCategory }) {
  const [search, setSearch] = useState("");

  const filtered = CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Section header + search */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Layanan &amp; Produk</h2>
          <p className="text-xs text-gray-400 mt-0.5">Pilih kategori untuk memulai transaksi</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category grid — Codashop style */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          Tidak ada layanan yang cocok dengan &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
              style={{ background: cat.gradient }}
            >
              {/* Decorative circle */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

              <div className="relative p-5 flex flex-col justify-between min-h-35">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>

                {/* Text */}
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{cat.label}</p>
                  <p className="text-[11px] text-white/70 mt-0.5 leading-snug">{cat.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

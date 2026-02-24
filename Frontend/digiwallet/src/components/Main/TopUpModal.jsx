import { useState, useEffect } from "react";
import { fetchProducts } from "../../services/productService";
import { createTransaction } from "../../services/transactionService";
import { getUser } from "../../services/authService";
import formatRupiah from "../../utils/currency";

// Product type labels
const TYPE_LABELS = {
  pulsa: "Pulsa",
  data: "Paket Data",
  pln: "Token PLN",
  pdam: "PDAM",
  internet: "Internet",
  game: "Game",
  ewallet: "E-Wallet",
};

export default function TopUpModal({ onClose, onSuccess, initialType = null, initialProduct = null }) {
  const user = getUser();
  // If initialProduct supplied → skip to step 3 (customer number).
  // If initialType supplied  → skip to step 2 (product list).
  // Otherwise start at step 1 (pick type).
  const [step, setStep] = useState(initialProduct ? 3 : initialType ? 2 : 1);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedType, setSelectedType] = useState(initialProduct?.type ?? initialType);
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [customerNumber, setCustomerNumber] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // success result

  // Load products when type is selected
  useEffect(() => {
    if (!selectedType) return;
    setLoadingProducts(true);
    setError("");
    fetchProducts({ type: selectedType })
      .then((res) => {
        const list = res?.data ?? res ?? [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, [selectedType]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setSelectedProduct(null);
    setCustomerNumber("");
    setError("");
    setStep(2);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setError("");
    setStep(3);
  };

  const handleGoToConfirm = () => {
    if (!customerNumber.trim()) {
      setError("Nomor pelanggan wajib diisi");
      return;
    }
    setError("");
    setStep(4);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = await createTransaction({
        product_id: selectedProduct.id,
        customer_number: customerNumber.trim(),
      });
      setResult(data);
      setStep(5);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Transaksi gagal. Silakan coba lagi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const TAX_RATE = 0.11;
  const subtotal = selectedProduct ? parseFloat(selectedProduct.price) : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {step === 5 ? "Transaksi Berhasil" : "Beli Produk"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* ── Step 1: Pick product type ─────────────────────── */}
          {step === 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Pilih jenis produk:</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectType(key)}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow transition cursor-pointer"
                  >
                    <span className="text-lg">
                      {key === "pulsa" && "📱"}
                      {key === "data" && "📶"}
                      {key === "pln" && "⚡"}
                      {key === "pdam" && "💧"}
                      {key === "internet" && "🌐"}
                      {key === "game" && "🎮"}
                      {key === "ewallet" && "💳"}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Pick product ──────────────────────────── */}
          {step === 2 && (
            <div>
              <button
                onClick={() => initialType ? onClose() : setStep(1)}
                className="text-xs text-purple-600 hover:text-purple-700 mb-3 cursor-pointer"
              >
                ← Kembali
              </button>
              <p className="text-sm text-gray-500 mb-4">
                Pilih produk <span className="font-semibold">{TYPE_LABELS[selectedType]}</span>:
              </p>
              {loadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Tidak ada produk tersedia.</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {products.filter((p) => p.is_active).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow transition cursor-pointer text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{product.description || TYPE_LABELS[product.type]}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{formatRupiah(product.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Enter customer number ────────────────── */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="text-xs text-purple-600 hover:text-purple-700 mb-3 cursor-pointer"
              >
                ← Kembali
              </button>
              <p className="text-sm text-gray-500 mb-1">Produk: <span className="font-semibold text-gray-800">{selectedProduct?.name}</span></p>
              <p className="text-sm text-gray-500 mb-4">Harga: <span className="font-semibold text-gray-800">{formatRupiah(selectedProduct?.price)}</span></p>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Pelanggan / Tujuan</label>
              <input
                type="text"
                value={customerNumber}
                onChange={(e) => {
                  setCustomerNumber(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Contoh: 08123456789"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition mb-4"
              />
              <button
                onClick={handleGoToConfirm}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 transition cursor-pointer"
                style={{ backgroundColor: "#d4f53c" }}
              >
                Lanjutkan
              </button>
            </div>
          )}

          {/* ── Step 4: Confirm ──────────────────────────────── */}
          {step === 4 && (
            <div>
              <button
                onClick={() => setStep(3)}
                className="text-xs text-purple-600 hover:text-purple-700 mb-3 cursor-pointer"
              >
                ← Kembali
              </button>
              <p className="text-sm font-semibold text-gray-900 mb-4">Konfirmasi Pembelian</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Produk</span>
                  <span className="font-medium text-gray-800">{selectedProduct?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium text-gray-800">{TYPE_LABELS[selectedProduct?.type]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nomor Tujuan</span>
                  <span className="font-medium text-gray-800 font-mono">{customerNumber}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pajak (11%)</span>
                  <span className="font-medium text-gray-800">{formatRupiah(tax)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 transition cursor-pointer disabled:opacity-50"
                style={{ backgroundColor: "#d4f53c" }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                    Memproses…
                  </span>
                ) : (
                  "Bayar Sekarang"
                )}
              </button>
            </div>
          )}

          {/* ── Step 5: Success ──────────────────────────────── */}
          {step === 5 && result && (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Transaksi Diproses!</h3>
              <p className="text-sm text-gray-500 mb-4">
                Transaksi Anda sedang diproses dan akan selesai dalam beberapa menit.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 text-left mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Referensi</span>
                  <span className="font-mono font-medium text-gray-800">{result.reference_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-yellow-600">{result.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">{formatRupiah(result.amount)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 transition cursor-pointer"
                style={{ backgroundColor: "#d4f53c" }}
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

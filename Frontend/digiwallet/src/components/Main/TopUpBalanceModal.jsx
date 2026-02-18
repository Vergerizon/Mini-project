import { useState } from "react";
import axios from "axios";
import { getUser, getToken, updateLocalUser } from "../../services/authService";
import formatRupiah from "../../utils/currency";

const ADMIN_FEE = 1000;

const PRESETS = [
  { label: "Rp 50.000", value: 50000 },
  { label: "Rp 100.000", value: 100000 },
  { label: "Rp 200.000", value: 200000 },
  { label: "Rp 500.000", value: 500000 },
  { label: "Rp 1.000.000", value: 1000000 },
  { label: "Nominal lain", value: null },
];

export default function TopUpBalanceModal({ onClose, onSuccess }) {
  const user = getUser();

  const [step, setStep] = useState(1); // 1=pick amount, 2=confirm, 3=success
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newBalance, setNewBalance] = useState(null);

  const nominalAmount = (() => {
    if (selectedPreset !== null) return selectedPreset;
    const parsed = parseInt(customAmount.replace(/\D/g, ""), 10);
    return isNaN(parsed) ? 0 : parsed;
  })();

  const isCustom = selectedPreset === null && customAmount !== "";
  const totalBayar = nominalAmount + ADMIN_FEE;

  const handleSelectPreset = (value) => {
    if (value === null) {
      // custom
      setSelectedPreset(null);
      setCustomAmount("");
    } else {
      setSelectedPreset(value);
      setCustomAmount("");
    }
    setError("");
  };

  const handleGoToConfirm = () => {
    if (nominalAmount < 10000) {
      setError("Nominal top up minimal Rp 10.000");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const token = getToken();
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/users/me/topup`,
        { amount: nominalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data?.data;
      if (updatedUser) {
        updateLocalUser({ balance: updatedUser.balance });
        setNewBalance(parseFloat(updatedUser.balance));
      }
      setStep(3);
      if (onSuccess) onSuccess(updatedUser);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Top up gagal. Silakan coba lagi.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {step === 3 ? "Top Up Berhasil 🎉" : "Top Up Saldo"}
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

          {/* ── Step 1: Pick amount ─────────────────────────── */}
          {step === 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Pilih nominal top up:</p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {PRESETS.map((preset) => {
                  const active =
                    preset.value !== null
                      ? selectedPreset === preset.value
                      : isCustom || (selectedPreset === null && customAmount === "" && false);
                  return (
                    <button
                      key={preset.label}
                      onClick={() => handleSelectPreset(preset.value)}
                      className={`py-2.5 px-2 rounded-xl border text-sm font-medium transition cursor-pointer ${
                        active
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 text-gray-700 hover:border-purple-300"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              {(selectedPreset === null) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Masukkan nominal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={customAmount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setCustomAmount(raw);
                        setError("");
                      }}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* Fee breakdown preview */}
              {nominalAmount > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Nominal top up</span>
                    <span>{formatRupiah(nominalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya admin</span>
                    <span>{formatRupiah(ADMIN_FEE)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total yang dibayar</span>
                    <span>{formatRupiah(totalBayar)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleGoToConfirm}
                disabled={nominalAmount <= 0}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Lanjutkan
              </button>
            </div>
          )}

          {/* ── Step 2: Confirm ─────────────────────────────── */}
          {step === 2 && (
            <div>
              <button
                onClick={() => { setStep(1); setError(""); }}
                className="text-xs text-purple-600 hover:text-purple-700 mb-4 cursor-pointer"
              >
                ← Kembali
              </button>

              <p className="text-sm text-gray-500 mb-4">
                Konfirmasi detail top up berikut:
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm space-y-2.5">
                <div className="flex justify-between text-gray-600">
                  <span>Akun</span>
                  <span className="font-medium text-gray-900">{user?.name || user?.email}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Nominal top up</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(nominalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Biaya admin</span>
                  <span>{formatRupiah(ADMIN_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total yang dibayar</span>
                  <span>{formatRupiah(totalBayar)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                style={{ backgroundColor: "#7c3aed" }}
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {submitting ? "Memproses..." : "Konfirmasi Top Up"}
              </button>
            </div>
          )}

          {/* ── Step 3: Success ──────────────────────────────── */}
          {step === 3 && (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#d4f53c" }}
              >
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Top up sebesar</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatRupiah(nominalAmount)}
              </p>
              <p className="text-sm text-gray-500 mb-4">berhasil ditambahkan ke saldo Anda</p>

              {newBalance !== null && (
                <div className="bg-purple-50 rounded-xl px-4 py-3 mb-5 text-sm">
                  <span className="text-gray-500">Saldo sekarang: </span>
                  <span className="font-bold text-purple-700">{formatRupiah(newBalance)}</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "#7c3aed" }}
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

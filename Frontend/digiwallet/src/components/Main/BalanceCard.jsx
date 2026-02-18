import { MAIN_TEXT } from "../../constants";
import formatRupiah from "../../utils/currency";

export default function BalanceCard({ balance }) {
  const formattedBalance = formatRupiah(balance);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Decorative accent */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 -translate-y-8 translate-x-8"
        style={{ backgroundColor: "#d4f53c" }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 translate-y-6 -translate-x-6"
        style={{ backgroundColor: "#a855f7" }}
      />

      <p className="text-sm text-gray-400 mb-1">{MAIN_TEXT.TOTAL_BALANCE}</p>
      <h2 className="text-3xl font-bold mb-4 relative z-10">{formattedBalance}</h2>

      <div className="flex items-center gap-2 relative z-10">
        <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
          +12.5%
        </span>
        <span className="text-xs text-gray-400">{MAIN_TEXT.VS_LAST_MONTH}</span>
      </div>
    </div>
  );
}

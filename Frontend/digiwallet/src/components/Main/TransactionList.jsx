import { MAIN_TEXT } from "../../constants";
import formatRupiah from "../../utils/currency";

export default function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">{MAIN_TEXT.RECENT_TRANSACTIONS}</h3>
        <p className="text-sm text-gray-400 text-center py-8">{MAIN_TEXT.NO_TRANSACTIONS}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{MAIN_TEXT.RECENT_TRANSACTIONS}</h3>
        <button className="text-xs font-medium text-purple-600 hover:text-purple-700 cursor-pointer">
          {MAIN_TEXT.VIEW_ALL}
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: tx.type === "credit" ? "#d4f53c20" : "#f3e8ff" }}
            >
              {tx.type === "credit" ? "↓" : "↑"}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
              <p className="text-xs text-gray-400">{tx.date}</p>
            </div>

            {/* Amount */}
            <span
              className={`text-sm font-semibold ${
                tx.type === "credit" ? "text-green-600" : "text-gray-900"
              }`}
            >
              {tx.type === "credit" ? "+" : "-"}{formatRupiah(Math.abs(tx.amount))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

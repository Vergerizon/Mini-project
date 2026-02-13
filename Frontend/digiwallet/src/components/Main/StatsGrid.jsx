import { MAIN_TEXT } from "../../constants";

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: stat.bgColor || "#f3e8ff" }}
            >
              {stat.icon}
            </div>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          {stat.change && (
            <span
              className={`text-xs font-medium ${
                stat.change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.change > 0 ? "+" : ""}
              {stat.change}% {MAIN_TEXT.VS_LAST_MONTH.toLowerCase()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

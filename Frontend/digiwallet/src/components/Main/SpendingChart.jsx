export default function SpendingChart() {
  const bars = [
    { label: "Mon", height: 45 },
    { label: "Tue", height: 70 },
    { label: "Wed", height: 55 },
    { label: "Thu", height: 85 },
    { label: "Fri", height: 60 },
    { label: "Sat", height: 40 },
    { label: "Sun", height: 30 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Weekly Spending</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#d4f53c" }} />
            <span className="text-xs text-gray-500">This week</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
            <span className="text-xs text-gray-500">Last week</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 h-32">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end" style={{ height: "100%" }}>
              <div
                className="flex-1 rounded-t-md transition-all"
                style={{
                  height: `${bar.height}%`,
                  backgroundColor: "#d4f53c",
                }}
              />
              <div
                className="flex-1 bg-gray-200 rounded-t-md"
                style={{ height: `${Math.max(20, bar.height - 15)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

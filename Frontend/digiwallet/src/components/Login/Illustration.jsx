export default function Illustration() {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-8 relative overflow-hidden h-full">
      {/* Heading */}
      <div className="text-center mb-8 z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Start turning your ideas into reality.
        </h2>
        <p className="text-sm text-gray-500">
          Create a free account and get full access to all features for 30-days. No credit card needed.
        </p>
      </div>

      {/* Trust badge */}
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-6 z-10">
        <div className="flex -space-x-2">
          <div className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white"></div>
          <div className="w-7 h-7 rounded-full bg-blue-400 border-2 border-white"></div>
          <div className="w-7 h-7 rounded-full bg-green-400 border-2 border-white"></div>
          <div className="w-7 h-7 rounded-full bg-yellow-400 border-2 border-white"></div>
        </div>
        <span className="text-xs text-gray-600 font-medium">Loved by 10,000+ users</span>
      </div>

      {/* Cards container */}
      <div className="relative w-full max-w-sm z-10">
        {/* Tabs card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex gap-1 mb-4">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-900 text-white">Usage</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Billing</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:bg-gray-100">Services</button>
          </div>
          {/* Simplified bar chart */}
          <div className="flex items-end gap-2 h-24">
            <div className="flex-1 rounded-t" style={{ height: "40%", backgroundColor: "#d4f53c" }}></div>
            <div className="flex-1 bg-gray-200 rounded-t" style={{ height: "60%" }}></div>
            <div className="flex-1 rounded-t" style={{ height: "80%", backgroundColor: "#d4f53c" }}></div>
            <div className="flex-1 bg-gray-200 rounded-t" style={{ height: "45%" }}></div>
            <div className="flex-1 rounded-t" style={{ height: "90%", backgroundColor: "#d4f53c" }}></div>
            <div className="flex-1 bg-gray-200 rounded-t" style={{ height: "55%" }}></div>
            <div className="flex-1 rounded-t" style={{ height: "70%", backgroundColor: "#d4f53c" }}></div>
            <div className="flex-1 bg-gray-200 rounded-t" style={{ height: "50%" }}></div>
          </div>
        </div>

        {/* Chart card with purple border */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-700">Performance</span>
            <span className="text-xs text-green-500 font-medium">+12.5%</span>
          </div>
          {/* Simplified line chart */}
          <svg viewBox="0 0 200 60" className="w-full h-12">
            <polyline
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              points="0,45 25,40 50,30 75,35 100,20 125,25 150,15 175,18 200,10"
            />
            <polyline
              fill="none"
              stroke="#d4f53c"
              strokeWidth="2"
              points="0,50 25,48 50,42 75,44 100,38 125,40 150,32 175,30 200,25"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

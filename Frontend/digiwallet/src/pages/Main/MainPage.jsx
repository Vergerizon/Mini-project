import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUser } from "../../services/authService";
import {
  MAIN_TEXT,
  MOCK_TRANSACTIONS,
  MOCK_CARDS,
  MOCK_STATS,
} from "../../constants";
import {
  Sidebar,
  BalanceCard,
  QuickActions,
  TransactionList,
  WalletCard,
  StatsGrid,
  SpendingChart,
} from "../../components/Main";

export default function MainPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const user = getUser();
  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleQuickAction = (actionId) => {
    // TODO: implement quick action modals
    console.log("Quick action:", actionId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {MAIN_TEXT.WELCOME_BACK}, {displayName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {MAIN_TEXT.GREETING_SUBTITLE}
            </p>
          </div>

          {/* Search + notification */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
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
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column — 2/3 */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Balance + Stats */}
              <BalanceCard balance={24563.80} />
              <StatsGrid stats={MOCK_STATS} />

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  {MAIN_TEXT.QUICK_ACTIONS}
                </h3>
                <QuickActions onAction={handleQuickAction} />
              </div>

              {/* Spending Chart */}
              <SpendingChart />

              {/* Transactions */}
              <TransactionList transactions={MOCK_TRANSACTIONS} />
            </div>

            {/* Right column — 1/3 */}
            <div className="flex flex-col gap-6">
              {/* Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {MAIN_TEXT.MY_CARDS}
                  </h3>
                  <button className="text-xs font-medium text-purple-600 hover:text-purple-700 cursor-pointer">
                    + Add card
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {MOCK_CARDS.map((card) => (
                    <WalletCard key={card.id} card={card} />
                  ))}
                </div>
              </div>

              {/* Activity summary */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Transactions today</span>
                    <span className="text-sm font-semibold text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Pending</span>
                    <span className="text-sm font-semibold text-yellow-600">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Cards active</span>
                    <span className="text-sm font-semibold text-green-600">2</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Monthly budget used</span>
                    <span className="text-xs font-medium text-gray-700">65%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: "65%", backgroundColor: "#d4f53c" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
          © 2026 DigiWallet. All rights reserved.{" "}
          <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
        </footer>
      </main>
    </div>
  );
}

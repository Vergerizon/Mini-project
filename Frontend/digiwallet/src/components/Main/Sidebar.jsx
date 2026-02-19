import { useEffect } from "react";
import { getUser } from "../../services/authService";
import { getNavigation } from "../../services/configService";
import { MAIN_TEXT } from "../../constants";

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
  const user = getUser();
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  // Navigation items come from the backend config — no hardcoded role checks
  let navItems = getNavigation() || [];

  // Fallback to minimal nav when backend did not provide any
  if (!navItems || navItems.length === 0) {
    navItems = [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "transactions", label: "Transaksi", icon: "📋" },
      { id: "profile", label: "Profil", icon: "👤" },
    ];
  }

  // Ensure the active tab is valid for the current nav; if not, switch to the first available
  useEffect(() => {
    const found = navItems.find((i) => i.id === activeTab);
    if (!found) {
      const first = navItems[0]?.id || "profile";
      onTabChange(first);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, navItems]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "#d4f53c" }}
        >
          <span className="text-sm font-bold text-gray-900">D</span>
        </div>
        <span className="text-lg font-bold text-gray-900">DigiWallet</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition cursor-pointer ${
              activeTab === item.id
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-purple-600">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={onLogout}
            title={MAIN_TEXT.LOGOUT}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

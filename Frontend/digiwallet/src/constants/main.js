export const MAIN_TEXT = {
  DASHBOARD: "Dashboard",
  TOTAL_BALANCE: "Total Balance",
  VS_LAST_MONTH: "vs last month",
  RECENT_TRANSACTIONS: "Recent Transactions",
  VIEW_ALL: "View all",
  NO_TRANSACTIONS: "No transactions yet.",
  QUICK_ACTIONS: "Quick Actions",
  MY_CARDS: "My Cards",
  LOGOUT: "Log out",
  WELCOME_BACK: "Welcome back",
  GREETING_SUBTITLE: "Here's what's happening with your wallet today.",
};

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "transactions", label: "Transactions", icon: "📋" },
  { id: "cards", label: "Cards", icon: "💳" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

export const QUICK_ACTIONS = [
  { id: "send", label: "Send Money", icon: "↗", bgColor: "#d4f53c" },
  { id: "receive", label: "Receive", icon: "↙", bgColor: "#f3e8ff" },
  { id: "topup", label: "Top Up", icon: "➕", bgColor: "#ecfdf5" },
  { id: "pay", label: "Pay Bills", icon: "📄", bgColor: "#fef3c7" },
];

export const MOCK_TRANSACTIONS = [
  { id: 1, description: "Netflix Subscription", amount: 14.99, type: "debit", date: "Feb 13, 2026", category: "Entertainment" },
  { id: 2, description: "Salary Deposit", amount: 4500.00, type: "credit", date: "Feb 12, 2026", category: "Income" },
  { id: 3, description: "Uber Ride", amount: 23.50, type: "debit", date: "Feb 11, 2026", category: "Transport" },
  { id: 4, description: "Freelance Payment", amount: 850.00, type: "credit", date: "Feb 10, 2026", category: "Income" },
  { id: 5, description: "Grocery Store", amount: 67.30, type: "debit", date: "Feb 9, 2026", category: "Food" },
  { id: 6, description: "Electric Bill", amount: 120.00, type: "debit", date: "Feb 8, 2026", category: "Utilities" },
];

export const MOCK_CARDS = [
  {
    id: 1,
    type: "Debit Card",
    network: "VISA",
    lastFour: "4291",
    holder: "Alex Johnson",
    expiry: "09/28",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
  },
  {
    id: 2,
    type: "Credit Card",
    network: "MC",
    lastFour: "8832",
    holder: "Alex Johnson",
    expiry: "03/27",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
  },
];

export const MOCK_STATS = [
  { label: "Income", value: "$5,350.00", icon: "📥", bgColor: "#d4f53c40", change: 12.5 },
  { label: "Expenses", value: "$1,225.79", icon: "📤", bgColor: "#f3e8ff", change: -3.2 },
  { label: "Savings", value: "$4,124.21", icon: "🏦", bgColor: "#ecfdf5", change: 8.1 },
];

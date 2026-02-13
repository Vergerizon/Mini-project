import { QUICK_ACTIONS } from "../../constants";

export default function QuickActions({ onAction }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition cursor-pointer group"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg transition"
            style={{ backgroundColor: action.bgColor }}
          >
            {action.icon}
          </div>
          <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

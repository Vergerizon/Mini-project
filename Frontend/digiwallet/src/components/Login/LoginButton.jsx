export default function LoginButton({ text, onClick, loading, variant = "primary" }) {
  if (variant === "secondary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
      >
        {text}
      </button>
    );
  }

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 transition cursor-pointer disabled:opacity-60"
      style={{ backgroundColor: "#d4f53c" }}
    >
      {loading ? "Signing in..." : text}
    </button>
  );
}

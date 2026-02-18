import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { LOGIN_TEXT, LOGIN_FIELDS, LOGIN_MESSAGES } from "../../constants";
import { InputField, LoginButton, Illustration, Footer } from "../../components/Login";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        LOGIN_MESSAGES.NETWORK_ERROR
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-150">
        {/* Left — Form */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#d4f53c" }}>
              <span className="text-sm font-bold text-gray-900">D</span>
            </div>
            <span className="text-lg font-bold text-gray-900">DigiWallet</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {LOGIN_TEXT.TITLE}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {LOGIN_TEXT.SUBTITLE}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              {...LOGIN_FIELDS.EMAIL}
              value={form.email}
              onChange={handleChange}
            />
            <InputField
              {...LOGIN_FIELDS.PASSWORD}
              value={form.password}
              onChange={handleChange}
            />

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">{LOGIN_TEXT.REMEMBER}</span>
              </label>
              <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                {LOGIN_TEXT.FORGOT_PASSWORD}
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <LoginButton text={LOGIN_TEXT.SIGN_IN} loading={loading} />
              <LoginButton text={LOGIN_TEXT.SIGN_IN_CODE} variant="secondary" />
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {LOGIN_TEXT.NO_ACCOUNT}{" "}
            <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700">
              {LOGIN_TEXT.SIGN_UP}
            </Link>
          </p>

          <Footer />
        </div>

        {/* Right — Illustration */}
        <Illustration />
      </div>
    </div>
  );
}

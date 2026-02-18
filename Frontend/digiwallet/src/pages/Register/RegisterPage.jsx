import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import {
  REGISTER_TEXT,
  REGISTER_FIELDS,
  REGISTER_MESSAGES,
} from "../../constants";
import {
  InputField,
  LoginButton,
  Illustration,
  Footer,
} from "../../components/Login";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError(REGISTER_MESSAGES.PASSWORD_MISMATCH);
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number || undefined,
      });
      setSuccess(REGISTER_MESSAGES.SUCCESS);
      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        REGISTER_MESSAGES.NETWORK_ERROR;

      // Handle validation errors array from backend
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors
          .map((e) => e.message)
          .join(". ");
        setError(validationErrors);
      } else {
        setError(msg);
      }
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
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#d4f53c" }}
            >
              <span className="text-sm font-bold text-gray-900">D</span>
            </div>
            <span className="text-lg font-bold text-gray-900">DigiWallet</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {REGISTER_TEXT.TITLE}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {REGISTER_TEXT.SUBTITLE}
          </p>

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {success}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              {...REGISTER_FIELDS.NAME}
              value={form.name}
              onChange={handleChange}
            />
            <InputField
              {...REGISTER_FIELDS.EMAIL}
              value={form.email}
              onChange={handleChange}
            />
            <InputField
              {...REGISTER_FIELDS.PHONE}
              value={form.phone_number}
              onChange={handleChange}
            />
            <InputField
              {...REGISTER_FIELDS.PASSWORD}
              value={form.password}
              onChange={handleChange}
            />
            <InputField
              {...REGISTER_FIELDS.CONFIRM_PASSWORD}
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <div className="mt-6">
              <LoginButton
                text={REGISTER_TEXT.SIGN_UP}
                loading={loading}
              />
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {REGISTER_TEXT.ALREADY_HAVE_ACCOUNT}{" "}
            <Link
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              {REGISTER_TEXT.SIGN_IN}
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

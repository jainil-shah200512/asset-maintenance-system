import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { setAuthData } from "../utils/auth";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin");
    else if (role === "MANAGER") navigate("/manager");
    else if (role === "TECHNICIAN") navigate("/technician");
    else navigate("/user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      setAuthData({
        token: data.token,
        role: data.role,
        email: data.email,
        fullName: data.fullName,
      });

      redirectByRole(data.role);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left panel */}
        <div className="hidden bg-slate-900 lg:flex lg:flex-col lg:justify-center lg:px-16 xl:px-24">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Asset Maintenance System
            </h1>
            <p className="mt-6 text-lg text-slate-300">
              Manage assets, tasks, technicians, material requests, and workflow
              approvals in one place.
            </p>

            <div className="mt-10 space-y-4 text-slate-200">
              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <h3 className="font-semibold">Role-based dashboards</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Separate views for manager, technician, and user.
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <h3 className="font-semibold">Track complete workflow</h3>
                <p className="mt-1 text-sm text-slate-300">
                  From task reporting to approvals, completion, and confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right/login panel */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Sign in to continue to the Asset Maintenance System
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Register
              </Link>
            </p>

            {/* <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-700">Test Accounts</p>
              <ul className="mt-2 space-y-1">
                <li>USER → user@siemens.com</li>
                <li>MANAGER → manager@siemens.com</li>
                <li>TECHNICIAN → technician@siemens.com</li>
                <li>Password → password123</li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
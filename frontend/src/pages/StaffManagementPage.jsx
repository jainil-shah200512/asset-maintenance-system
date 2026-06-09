import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/Navbar";

function StaffManagementPage() {
  const [technicianForm, setTechnicianForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRegularUsers = async () => {
    try {
      const response = await API.get("/users/regular-users");
      setRegularUsers(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load regular users.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchRegularUsers();
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setTechnicianForm({
      ...technicianForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTechnician = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.post("/users/technicians", technicianForm);

      setSuccess("Technician created successfully.");
      setTechnicianForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      fetchRegularUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create technician.");
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId) => {
    const confirmed = window.confirm("Promote this user to TECHNICIAN?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await API.put(`/users/${userId}/promote-to-technician`);

      setSuccess("User promoted to technician successfully.");
      fetchRegularUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to promote user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Staff Management
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Create technician accounts and promote regular users to technician.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Create Technician */}
          <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">Create Technician</h3>

            <form onSubmit={handleCreateTechnician} className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={technicianForm.firstName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={technicianForm.lastName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={technicianForm.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={technicianForm.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Creating..." : "Create Technician"}
                </button>
              </div>
            </form>
          </div>

          {/* Promote User */}
          <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">Promote User → Technician</h3>

            {pageLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading users...</p>
            ) : regularUsers.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No regular users found.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {regularUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>

                    <button
                      onClick={() => handlePromote(user.id)}
                      disabled={loading}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Promote to Technician
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StaffManagementPage;

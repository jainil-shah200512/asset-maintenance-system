import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import AssetCard from "../components/AssetCard";
import { getRole } from "../utils/auth";

function AssetsPage() {
  const navigate = useNavigate();
  const role = getRole();
  const canManage = role === "MANAGER";

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
  });

  const statusOptions = [
    "OPERATIONAL",
    "UNDER_MAINTENANCE",
    "DECOMMISSIONED",
  ];

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (filters.keyword.trim() || filters.status) {
        const params = {};

        if (filters.keyword.trim()) params.keyword = filters.keyword.trim();
        if (filters.status) params.status = filters.status;

        response = await API.get("/assets/search", { params });
      } else {
        response = await API.get("/assets");
      }

      setAssets(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAssets();
  };

  const handleClear = () => {
    setFilters({
      keyword: "",
      status: "",
    });

    setTimeout(() => {
      fetchAssets();
    }, 0);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this asset?");
    if (!confirmed) return;

    try {
      await API.delete(`/assets/${id}`);
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete asset");
    }
  };

  const handleEdit = (id) => {
    navigate(`/assets/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Assets
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Browse, search, and manage maintenance assets.
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => navigate("/assets/new")}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Create Asset
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow sm:p-5">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Keyword
              </label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleChange}
                placeholder="Search by code, name, or location"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3 md:col-span-2 xl:col-span-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            Loading assets...
          </div>
        ) : assets.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <h3 className="text-lg font-semibold text-slate-800">No assets found</h3>
            <p className="mt-2 text-sm text-slate-600">
              Try changing the search or filter options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {assets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                canManage={canManage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AssetsPage;
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { getRole } from "../utils/auth";

function TasksPage() {
  const navigate = useNavigate();
  const role = getRole();

  const [searchParams, setSearchParams] = useSearchParams();

  const canCreateTask = role === "USER" || role === "MANAGER";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewMode, setViewMode] = useState(searchParams.get("view") || "active");

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
  });

  const activeStatusOptions = [
    "REPORTED",
    "UNDER_REVIEW",
    "ASSIGNED",
    "IN_PROGRESS",
    "PENDING_MATERIAL_APPROVAL",
    "MATERIAL_APPROVED",
    "MATERIAL_REJECTED",
    "COMPLETED",
    "CONFIRMED",
    "REWORK_REQUIRED",
  ];

  const priorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const titleMap = {
    MANAGER: "Tasks",
    TECHNICIAN: "Tasks",
    USER: "Tasks",
  };

  const subtitleMap = {
    MANAGER: "Search, manage, and monitor tasks across the system.",
    TECHNICIAN: "Track assigned work and completed task history.",
    USER: "View your reported tasks and archived task history.",
  };

  const updateSearchParams = (newFilters, newViewMode) => {
    const params = {};

    if (newViewMode) params.view = newViewMode;
    if (newFilters.keyword) params.keyword = newFilters.keyword;
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.priority) params.priority = newFilters.priority;

    setSearchParams(params);
  };

  const fetchTasks = async (currentFilters = filters, currentViewMode = viewMode) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (currentFilters.keyword.trim()) params.keyword = currentFilters.keyword.trim();

      if (currentViewMode === "archived") {
        params.status = "CLOSED";
      } else {
        if (currentFilters.status) params.status = currentFilters.status;
      }

      if (currentFilters.priority && role === "MANAGER") {
        params.priority = currentFilters.priority;
      }

      const response = await API.get("/tasks", { params });

      let fetchedTasks = response.data || [];

      if (currentViewMode === "active") {
        fetchedTasks = fetchedTasks.filter((task) => task.status !== "CLOSED");
      }

      setTasks(fetchedTasks);
      updateSearchParams(currentFilters, currentViewMode);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlView = searchParams.get("view") || "active";
    const urlKeyword = searchParams.get("keyword") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlPriority = searchParams.get("priority") || "";

    const newFilters = {
      keyword: urlKeyword,
      status: urlStatus,
      priority: urlPriority,
    };

    setViewMode(urlView);
    setFilters(newFilters);

    fetchTasks(newFilters, urlView);
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
    fetchTasks(filters, viewMode);
  };

  const handleClear = () => {
    const clearedFilters = {
      keyword: "",
      status: "",
      priority: "",
    };

    setFilters(clearedFilters);
    fetchTasks(clearedFilters, viewMode);
  };

  const switchToActive = () => {
    const updatedFilters = {
      ...filters,
      status: "",
    };
    setViewMode("active");
    setFilters(updatedFilters);
    fetchTasks(updatedFilters, "active");
  };

  const switchToArchived = () => {
    const updatedFilters = {
      ...filters,
      status: "",
    };
    setViewMode("archived");
    setFilters(updatedFilters);
    fetchTasks(updatedFilters, "archived");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {titleMap[role] || "Tasks"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              {subtitleMap[role] || "Manage tasks"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex rounded-xl border border-slate-300 bg-white p-1 shadow-sm">
              <button
                onClick={switchToActive}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "active"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Active Tasks
              </button>

              <button
                onClick={switchToArchived}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "archived"
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Archived Tasks
              </button>
            </div>

            {canCreateTask && viewMode === "active" && (
              <button
                onClick={() => navigate("/tasks/new")}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                + Create Task
              </button>
            )}
          </div>
        </div>

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
                placeholder={
                  viewMode === "archived"
                    ? "Search archived tasks"
                    : "Search by code or title"
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {viewMode === "active" && (
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
                  <option value="">All Active Statuses</option>
                  {activeStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role === "MANAGER" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={filters.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">All Priorities</option>
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end gap-3">
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

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            Loading {viewMode === "archived" ? "archived" : "active"} tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <h3 className="text-lg font-semibold text-slate-800">
              No {viewMode === "archived" ? "archived" : "active"} tasks found
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try changing the search/filter options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default TasksPage;
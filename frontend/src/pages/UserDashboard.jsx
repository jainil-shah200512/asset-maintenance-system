import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/user");
        setData(response.data);
      } catch (error) {
        console.error("Failed to load user dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            User Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            View the tasks you have reported.
          </p>
        </div>

        {!data ? (
          <div className="rounded-xl bg-white p-6 text-center shadow">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <button
              onClick={() => navigate("/tasks?view=active")}
              className="rounded-2xl bg-white p-5 text-left shadow transition hover:shadow-md hover:ring-2 hover:ring-slate-200"
            >
              <p className="text-sm font-medium text-slate-500">Total Reported Tasks</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900">
                {data.totalReportedTasks}
              </h3>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;

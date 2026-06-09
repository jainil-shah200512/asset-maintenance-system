import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";

function ManagerDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await API.get("/dashboard/manager");
        setData(response.data);
      } catch (error) {
        console.error("Failed to load manager dashboard", error);
      }
    };

    fetchDashboard();
  }, []);

  const handleCardClick = (status) => {
    if (status === "CLOSED") {
      navigate(`/tasks?status=${status}&view=archived`);
    } else {
      navigate(`/tasks?status=${status}&view=active`);
    }
  };

  const cards = data
    ? [
        { title: "Reported", value: data.reported, status: "REPORTED" },
        { title: "Under Review", value: data.underReview, status: "UNDER_REVIEW" },
        { title: "Assigned", value: data.assigned, status: "ASSIGNED" },
        { title: "In Progress", value: data.inProgress, status: "IN_PROGRESS" },
        { title: "Pending Material Approval", value: data.pendingMaterialApproval, status: "PENDING_MATERIAL_APPROVAL" },
        { title: "Material Approved", value: data.materialApproved, status: "MATERIAL_APPROVED" },
        { title: "Material Rejected", value: data.materialRejected, status: "MATERIAL_REJECTED" },
        { title: "Completed", value: data.completed, status: "COMPLETED" },
        { title: "Confirmed", value: data.confirmed, status: "CONFIRMED" },
        { title: "Closed", value: data.closed, status: "CLOSED" },
        { title: "Total Tasks", value: data.totalTasks, status: null },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Manager Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Monitor all task workflow metrics across the system.
          </p>
        </div>

        {!data ? (
          <div className="rounded-xl bg-white p-6 text-center shadow">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <button
                key={card.title}
                onClick={() => {
                  if (card.status) {
                    handleCardClick(card.status);
                  } else {
                    navigate("/tasks?view=active");
                  }
                }}
                className="rounded-2xl bg-white p-5 text-left shadow transition hover:shadow-md hover:ring-2 hover:ring-slate-200"
              >
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <h3 className="mt-3 text-3xl font-bold text-slate-900">
                  {card.value}
                </h3>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;
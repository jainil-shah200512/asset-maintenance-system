import { useNavigate } from "react-router-dom";

function TaskCard({ task }) {
  const navigate = useNavigate();

  const statusColorMap = {
    REPORTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    ASSIGNED: "bg-purple-100 text-purple-700",
    IN_PROGRESS: "bg-orange-100 text-orange-700",
    PENDING_MATERIAL_APPROVAL: "bg-amber-100 text-amber-700",
    MATERIAL_APPROVED: "bg-emerald-100 text-emerald-700",
    MATERIAL_REJECTED: "bg-red-100 text-red-700",
    COMPLETED: "bg-green-100 text-green-700",
    CONFIRMED: "bg-teal-100 text-teal-700",
    CLOSED: "bg-slate-200 text-slate-700",
    REWORK_REQUIRED: "bg-red-100 text-red-700",
  };

  const priorityColorMap = {
    LOW: "bg-slate-100 text-slate-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow transition hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{task.taskCode}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              statusColorMap[task.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {task.status}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              priorityColorMap[task.priority] || "bg-slate-100 text-slate-700"
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-slate-600">
        {task.description || "No description provided."}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-700">Asset</p>
          <p>{task.assetName || "No asset linked"}</p>
        </div>

        <div>
          <p className="font-medium text-slate-700">Due Date</p>
          <p>{task.dueDate ? new Date(task.dueDate).toLocaleString() : "Not set"}</p>
        </div>

        <div>
          <p className="font-medium text-slate-700">Reported By</p>
          <p>{task.reportedByEmail || "-"}</p>
        </div>

        <div>
          <p className="font-medium text-slate-700">Assigned To</p>
          <p>{task.assignedToEmail || "Not assigned"}</p>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => navigate(`/tasks/${task.id}`)}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default TaskCard;

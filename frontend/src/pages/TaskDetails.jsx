import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/Navbar";
import TaskActionPanel from "../components/TaskActionPanel";
import MaterialRequestPanel from "../components/MaterialRequestPanel";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [logs, setLogs] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [taskResponse, logsResponse, requestsResponse] = await Promise.all([
        API.get(`/tasks/${id}`),
        API.get(`/tasks/${id}/activity-logs`),
        API.get(`/material-requests/task/${id}`),
      ]);

      setTask(taskResponse.data);
      setLogs(logsResponse.data);
      setMaterialRequests(requestsResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

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
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Task Details
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              View task information, actions, material requests, and activity history.
            </p>
          </div>

          <button
            onClick={() => navigate("/tasks")}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Tasks
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            Loading task details...
          </div>
        ) : task ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left + center */}
            <div className="space-y-6 xl:col-span-2">
              {/* Task details */}
              <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
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

                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-700">Description</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Asset</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.assetName || "No asset linked"}
                    </p>
                    {task.assetCode && (
                      <p className="mt-1 text-xs text-slate-500">{task.assetCode}</p>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Due Date</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.dueDate ? new Date(task.dueDate).toLocaleString() : "Not set"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Reported By</p>
                    <p className="mt-1 text-sm text-slate-600">{task.reportedByEmail || "-"}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Assigned To</p>
                    <p className="mt-1 text-sm text-slate-600">{task.assignedToEmail || "Not assigned"}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Assigned By</p>
                    <p className="mt-1 text-sm text-slate-600">{task.assignedByEmail || "-"}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">Created At</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Task actions */}
              <TaskActionPanel task={task} onRefresh={fetchTaskDetails} />

              {/* Material requests */}
              <MaterialRequestPanel
                task={task}
                requests={materialRequests}
                onRefresh={fetchTaskDetails}
              />
            </div>

            {/* Activity log sidebar */}
            <div>
              <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
                <h3 className="text-lg font-semibold text-slate-900">Activity Logs</h3>

                {logs.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">No activity logs found.</p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {log.action}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {log.performedByEmail}
                        </p>

                        <div className="mt-3 text-sm text-slate-600">
                          {log.oldStatus && (
                            <p>
                              <span className="font-medium text-slate-700">From:</span>{" "}
                              {log.oldStatus}
                            </p>
                          )}
                          {log.newStatus && (
                            <p>
                              <span className="font-medium text-slate-700">To:</span>{" "}
                              {log.newStatus}
                            </p>
                          )}
                          {log.remarks && (
                            <p className="mt-1">
                              <span className="font-medium text-slate-700">Remarks:</span>{" "}
                              {log.remarks}
                            </p>
                          )}
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default TaskDetails;
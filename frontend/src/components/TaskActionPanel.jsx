import { useEffect, useState } from "react";
import API from "../api/api";
import { getRole } from "../utils/auth";

function TaskActionPanel({ task, onRefresh }) {
  const role = getRole();

  const [technicians, setTechnicians] = useState([]);
  const [assignData, setAssignData] = useState({
    technicianId: "",
    remarks: "",
  });

  const [actionRemarks, setActionRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await API.get("/users/technicians");
        setTechnicians(response.data || []);
      } catch (err) {
        console.error("Failed to load technicians", err);
      }
    };

    if (role === "MANAGER") {
      fetchTechnicians();
    }
  }, [role]);

  const handleAssignChange = (e) => {
    setError("");
    setAssignData({
      ...assignData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssign = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.put(`/tasks/${task.id}/assign`, {
        technicianId: Number(assignData.technicianId),
        remarks: assignData.remarks,
      });

      setAssignData({
        technicianId: "",
        remarks: "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to assign task.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimpleAction = async (endpoint) => {
    try {
      setLoading(true);
      setError("");

      if (endpoint === "reject" && !actionRemarks.trim()) {
        setError("Remarks are required when rejecting completed work.");
        setLoading(false);
        return;
      }

      await API.put(`/tasks/${task.id}/${endpoint}`, {
        remarks: actionRemarks,
      });

      setActionRemarks("");
      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${endpoint} task.`);
    } finally {
      setLoading(false);
    }
  };

  const showAssign =
    role === "MANAGER" &&
    !task.assignedToEmail &&
    ["REPORTED", "UNDER_REVIEW"].includes(task.status);

  const showConfirm =
    role === "MANAGER" &&
    task.status === "COMPLETED";

  const showReject =
    role === "MANAGER" &&
    task.status === "COMPLETED";

  const showClose =
    role === "MANAGER" &&
    task.status === "CONFIRMED";

  const showStart =
    role === "TECHNICIAN" &&
    ["ASSIGNED", "MATERIAL_APPROVED", "REWORK_REQUIRED"].includes(task.status);

  const showComplete =
    role === "TECHNICIAN" &&
    ["IN_PROGRESS", "MATERIAL_APPROVED"].includes(task.status);

  if (!showAssign && !showConfirm && !showReject && !showClose && !showStart && !showComplete) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">Task Actions</h3>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 space-y-6">
        {/* Manager Assign */}
        {showAssign && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-semibold text-slate-800">Assign Task</h4>
            <p className="mt-1 text-xs text-slate-500">
              Select a technician from the dropdown.
            </p>

            <form
              onSubmit={handleAssign}
              className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Select Technician
                </label>

                <select
                  name="technicianId"
                  value={assignData.technicianId}
                  onChange={handleAssignChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                  required
                >
                  <option value="">Select technician</option>

                  {technicians.map((tech) => (
                    <option key={tech.id} value={tech.id}>
                      {tech.fullName} ({tech.email})
                    </option>
                  ))}
                </select>

                {technicians.length === 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    No technicians found or still loading...
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  value={assignData.remarks}
                  onChange={handleAssignChange}
                  placeholder="Optional remarks"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Assigning..." : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Common remarks box for start / complete / confirm / reject / close */}
        {(showStart || showComplete || showConfirm || showReject || showClose) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Remarks
            </label>
            <textarea
              value={actionRemarks}
              onChange={(e) => setActionRemarks(e.target.value)}
              placeholder="Enter remarks (optional for most actions, required for reject)"
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {showStart && (
                <button
                  onClick={() => handleSimpleAction("start")}
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading
                    ? "Processing..."
                    : ["MATERIAL_APPROVED", "REWORK_REQUIRED"].includes(task.status)
                    ? "Resume Task"
                    : "Start Task"}
                </button>
              )}

              {showComplete && (
                <button
                  onClick={() => handleSimpleAction("complete")}
                  disabled={loading}
                  className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Processing..." : "Complete Task"}
                </button>
              )}

              {showConfirm && (
                <button
                  onClick={() => handleSimpleAction("confirm")}
                  disabled={loading}
                  className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Processing..." : "Confirm Task"}
                </button>
              )}

              {showReject && (
                <button
                  onClick={() => handleSimpleAction("reject")}
                  disabled={loading}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Processing..." : "Reject Work"}
                </button>
              )}

              {showClose && (
                <button
                  onClick={() => handleSimpleAction("close")}
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {loading ? "Processing..." : "Close Task"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskActionPanel;

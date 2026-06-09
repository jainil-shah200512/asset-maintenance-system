import { useState } from "react";
import API from "../api/api";
import { getRole } from "../utils/auth";

function MaterialRequestPanel({ task, requests, onRefresh }) {
  const role = getRole();

  const [createData, setCreateData] = useState({
    materialDescription: "",
    quantity: "",
  });

  const [reviewState, setReviewState] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateChange = (e) => {
    setError("");
    setCreateData({
      ...createData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/material-requests", {
        taskId: task.id,
        materialDescription: createData.materialDescription,
        quantity: Number(createData.quantity),
      });

      setCreateData({
        materialDescription: "",
        quantity: "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create material request.");
    } finally {
      setLoading(false);
    }
  };

  const updateReviewState = (requestId, field, value) => {
    setReviewState((prev) => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (requestId, requestedQty) => {
    try {
      setLoading(true);
      setError("");

      const requestData = reviewState[requestId] || {};

      await API.put(`/material-requests/${requestId}/approve`, {
        approvedQuantity: requestData.approvedQuantity
          ? Number(requestData.approvedQuantity)
          : requestedQty,
        remarks: requestData.remarks || "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to approve request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      setError("");

      const requestData = reviewState[requestId] || {};

      await API.put(`/material-requests/${requestId}/reject`, {
        rejectionReason: requestData.rejectionReason || "",
      });

      onRefresh();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reject request.");
    } finally {
      setLoading(false);
    }
  };

  const canCreateRequest =
    role === "TECHNICIAN" &&
    !["COMPLETED", "CONFIRMED", "CLOSED"].includes(task.status);

  const statusColorMap = {
    PENDING: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PARTIALLY_APPROVED: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900">Material Requests</h3>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Technician create material request */}
      {canCreateRequest && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Create Material Request</h4>

          <form onSubmit={handleCreateRequest} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Material Description
              </label>
              <input
                type="text"
                name="materialDescription"
                value={createData.materialDescription}
                onChange={handleCreateChange}
                placeholder="Enter material description"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={createData.quantity}
                onChange={handleCreateChange}
                placeholder="Enter quantity"
                min="1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request list */}
      <div className="mt-6 space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-slate-600">No material requests found.</p>
        ) : (
          requests.map((request) => {
            const localReview = reviewState[request.id] || {};
            const isPending = request.status === "PENDING";
            const canReview = role === "MANAGER" && isPending;

            return (
              <div
                key={request.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {request.materialDescription}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Requested by: {request.requestedByEmail || "-"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      statusColorMap[request.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-slate-700">Requested Quantity</p>
                    <p>{request.quantity}</p>
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">Approved Quantity</p>
                    <p>{request.approvedQuantity ?? "-"}</p>
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">Created At</p>
                    <p>
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-slate-700">Reviewed By</p>
                    <p>{request.reviewedByEmail || "-"}</p>
                  </div>
                </div>

                {request.rejectionReason && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <span className="font-medium">Rejection Reason:</span>{" "}
                    {request.rejectionReason}
                  </div>
                )}

                {canReview && (
                  <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Approved Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={request.quantity}
                          value={localReview.approvedQuantity || ""}
                          onChange={(e) =>
                            updateReviewState(request.id, "approvedQuantity", e.target.value)
                          }
                          placeholder={`Default: ${request.quantity}`}
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Approval Remarks
                        </label>
                        <input
                          type="text"
                          value={localReview.remarks || ""}
                          onChange={(e) =>
                            updateReviewState(request.id, "remarks", e.target.value)
                          }
                          placeholder="Optional remarks"
                          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Rejection Reason
                      </label>
                      <input
                        type="text"
                        value={localReview.rejectionReason || ""}
                        onChange={(e) =>
                          updateReviewState(request.id, "rejectionReason", e.target.value)
                        }
                        placeholder="Enter rejection reason if rejecting"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() => handleApprove(request.id, request.quantity)}
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                        {loading ? "Processing..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={loading}
                        className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                      >
                        {loading ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MaterialRequestPanel;
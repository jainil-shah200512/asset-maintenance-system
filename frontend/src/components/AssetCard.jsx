function AssetCard({ asset, canManage, onEdit, onDelete }) {
  const statusColorMap = {
    OPERATIONAL: "bg-green-100 text-green-700",
    UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-700",
    DECOMMISSIONED: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow transition hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {asset.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{asset.assetCode}</p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            statusColorMap[asset.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {asset.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <p className="font-medium text-slate-700">Location</p>
          <p>{asset.location || "Not specified"}</p>
        </div>

        <div>
          <p className="font-medium text-slate-700">Created At</p>
          <p>
            {asset.createdAt
              ? new Date(asset.createdAt).toLocaleString()
              : "Not available"}
          </p>
        </div>
      </div>

      {canManage && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => onEdit(asset.id)}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(asset.id)}
            className="w-full rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 sm:w-auto"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default AssetCard;
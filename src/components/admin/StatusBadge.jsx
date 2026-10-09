export default function StatusBadge({
  status,
}) {
  const config = {
    published: {
      label: "Published",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    active: {
      label: "Active",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200",
    },

    draft: {
      label: "Draft",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
    },

    pending: {
      label: "Pending",
      className:
        "bg-orange-50 text-orange-700 border-orange-200",
    },

    approved: {
      label: "Approved",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    rejected: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },

    blocked: {
      label: "Blocked",
      className:
        "bg-red-50 text-red-700 border-red-200",
    },
  };

  const item =
    config[status] || {
      label: status || "Unknown",
      className:
        "bg-slate-50 text-slate-600 border-slate-200",
    };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
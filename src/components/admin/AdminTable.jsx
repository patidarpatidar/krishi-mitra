"use client";

import {
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export default function AdminTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  emptyMessage = "कोई रिकॉर्ड नहीं मिला",
}) {
  if (!data.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
        <p className="text-slate-500">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-5 py-4 font-semibold text-slate-600 whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}

              {(onEdit || onDelete || onView) && (
                <th className="px-5 py-4 text-right">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {data.map((row) => (

              <tr
                key={row.id}
                className="hover:bg-slate-50"
              >

                {columns.map((column) => (

                  <td
                    key={column.key}
                    className="px-5 py-4 text-slate-700"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key] ?? "-"}
                  </td>

                ))}

                {(onEdit || onDelete || onView) && (

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      {onView && (
                        <button
                          onClick={() =>
                            onView(row)
                          }
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {onEdit && (
                        <button
                          onClick={() =>
                            onEdit(row)
                          }
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() =>
                            onDelete(row)
                          }
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </td>
                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
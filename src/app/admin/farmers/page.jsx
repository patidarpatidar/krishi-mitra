"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
  Trash2,
  Shield,
  Sprout,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";
import { getAdminToken } from "@/lib/apiClient";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function FarmersAdminPage() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadFarmers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getAdminToken();
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(
        `${API_URL}/admin/farmers?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          cache: "no-store",
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "किसानों की सूची लोड नहीं हो सकी");
      }

      setFarmers(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Load farmers error:", err);
      setError(err.message || "डेटा लोड करने में समस्या हुई।");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFarmers();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadFarmers]);

  async function handleToggleStatus(farmer) {
    try {
      setActionLoading(`status-${farmer.id || farmer._id}`);
      setError("");
      setMessage("");

      const token = getAdminToken();
      const farmerId = farmer.id || farmer._id;

      const response = await fetch(
        `${API_URL}/admin/farmers/${encodeURIComponent(farmerId)}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Status अपडेट नहीं हो पाया");
      }

      setMessage(result.message || "Status सफलतापूर्वक बदला गया।");
      await loadFarmers();
    } catch (err) {
      console.error("Toggle status error:", err);
      setError(err.message || "Status बदलने में समस्या हुई।");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteFarmer(farmer) {
    const confirmed = window.confirm(
      `क्या आप किसान "${farmer.name}" का अकाउंट स्थायी रूप से डिलीट करना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${farmer.id || farmer._id}`);
      setError("");
      setMessage("");

      const token = getAdminToken();
      const farmerId = farmer.id || farmer._id;

      const response = await fetch(
        `${API_URL}/admin/farmers/${encodeURIComponent(farmerId)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "अकाउंट डिलीट नहीं हो पाया");
      }

      setMessage(result.message || "अकाउंट डिलीट कर दिया गया।");
      await loadFarmers();
    } catch (err) {
      console.error("Delete farmer error:", err);
      setError(err.message || "डिलीट करने में समस्या हुई।");
    } finally {
      setActionLoading(null);
    }
  }

  const activeCount = farmers.filter((x) => x.status !== "blocked").length;
  const blockedCount = farmers.filter((x) => x.status === "blocked").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-600 font-semibold text-sm">User Management</p>
          <h1 className="text-3xl font-bold text-slate-900">Registered Farmers</h1>
          <p className="text-slate-500 mt-1">
            वेबसाइट पर पंजीकृत सभी किसानों का लाइव डेटाबेस एवं अकाउंट प्रबंधन।
          </p>
        </div>

        <button
          onClick={loadFarmers}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition self-start sm:self-auto shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          रिफ्रेश करें
        </button>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3.5 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Users} label="Total Registered Farmers" value={farmers.length} color="text-slate-900" />
        <Stat icon={UserCheck} label="Active Farmers" value={activeCount} color="text-emerald-600" />
        <Stat icon={UserX} label="Blocked Accounts" value={blockedCount} color="text-red-600" />
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="नाम, मोबाइल, ईमेल या गाँव से खोजें..."
            className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 bg-white text-slate-700"
        >
          <option value="all">सभी Status</option>
          <option value="active">Active केवल</option>
          <option value="blocked">Blocked केवल</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="text-left px-5 py-3.5">किसान</th>
                <th className="text-left px-5 py-3.5">मोबाइल</th>
                <th className="text-left px-5 py-3.5">ईमेल</th>
                <th className="text-left px-5 py-3.5">भूमि / सिंचाई</th>
                <th className="text-left px-5 py-3.5">पंजीकृत फसलें</th>
                <th className="text-left px-5 py-3.5">Status</th>
                <th className="text-right px-5 py-3.5">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading && farmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    डेटा लोड हो रहा है...
                  </td>
                </tr>
              ) : farmers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    अभी कोई पंजीकृत किसान नहीं मिला।
                  </td>
                </tr>
              ) : (
                farmers.map((farmer) => {
                  const farmerId = farmer.id || farmer._id;
                  const isStatusLoading = actionLoading === `status-${farmerId}`;
                  const isDeleteLoading = actionLoading === `delete-${farmerId}`;

                  return (
                    <tr key={farmerId} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{farmer.name}</p>
                        <p className="text-xs text-slate-500">
                          {farmer.village ? `${farmer.village}, ` : ""}
                          {farmer.district || "नीमच"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700 font-medium">
                        {farmer.phone}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {farmer.email}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        <span className="font-semibold">{farmer.landArea || 0}</span> {farmer.landUnit || "Acre"}
                        {farmer.irrigation && (
                          <span className="block text-xs text-slate-500">
                            {farmer.irrigation}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Sprout className="w-3.5 h-3.5" />
                          {farmer.cropsCount || 0} फसलें
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={farmer.status || "active"} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/view/farmers/${farmerId}`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(farmer)}
                            disabled={isStatusLoading}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                              farmer.status === "blocked"
                                ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                : "border-amber-300 text-amber-700 hover:bg-amber-50"
                            }`}
                          >
                            {isStatusLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : farmer.status === "blocked" ? (
                              "Unblock"
                            ) : (
                              "Block"
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteFarmer(farmer)}
                            disabled={isDeleteLoading}
                            title="अकाउंट हटाएं"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            {isDeleteLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <Icon className="text-emerald-600 mb-2 w-6 h-6" />
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

import {
  Search,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";

export default function FarmersAdminPage() {
  const [farmers, setFarmers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const stored =
      localStorage.getItem(
        "krishi_mitra_farmers"
      );

    if (stored) {
      try {
        setFarmers(
          JSON.parse(stored)
        );
      } catch {
        setFarmers([]);
      }
    }
  }, []);

  const filtered =
    farmers.filter((farmer) =>
      `${farmer.name || ""} ${
        farmer.email || ""
      } ${farmer.phone || ""}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="space-y-6">

      <div>

        <p className="text-emerald-600 font-semibold">
          User Management
        </p>

        <h1 className="text-3xl font-bold">
          Registered Farmers
        </h1>

        <p className="text-slate-500 mt-1">
          किसान accounts और basic information manage करें।
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <Stat
          icon={Users}
          label="Total Farmers"
          value={farmers.length}
        />

        <Stat
          icon={UserCheck}
          label="Active"
          value={
            farmers.filter(
              (x) =>
                x.status !==
                "blocked"
            ).length
          }
        />

        <Stat
          icon={UserX}
          label="Blocked"
          value={
            farmers.filter(
              (x) =>
                x.status ===
                "blocked"
            ).length
          }
        />

      </div>

      <div className="bg-white border rounded-2xl p-4">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="नाम, मोबाइल या email खोजें..."
            className="w-full border rounded-xl pl-10 pr-4 py-3"
          />

        </div>

      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 border-b">

              <tr>

                <th className="text-left px-5 py-4">
                  Farmer
                </th>

                <th className="text-left px-5 py-4">
                  Mobile
                </th>

                <th className="text-left px-5 py-4">
                  Email
                </th>

                <th className="text-left px-5 py-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {filtered.map((farmer) => (

                <tr key={farmer.id}>

                  <td className="px-5 py-4">

                    <p className="font-bold">
                      {farmer.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {farmer.district ||
                        "—"}
                    </p>

                  </td>

                  <td className="px-5 py-4">
                    {farmer.phone}
                  </td>

                  <td className="px-5 py-4">
                    {farmer.email}
                  </td>

                  <td className="px-5 py-4">

                    <StatusBadge
                      status={
                        farmer.status ||
                        "active"
                      }
                    />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {!filtered.length && (
          <div className="p-12 text-center text-slate-500">
            अभी कोई registered farmer नहीं है।
          </div>
        )}

      </div>

    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-white border rounded-2xl p-5">

      <Icon className="text-emerald-600 mb-3" />

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}
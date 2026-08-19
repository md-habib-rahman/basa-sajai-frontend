import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  FiUsers,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiCheck,
  FiClock,
} from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setUpdatingId(userId);
      const res = await api.patch(`/users/${userId}`, {
        isActive: !currentStatus,
      });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isActive: !currentStatus } : u,
          ),
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      const res = await api.patch(`/users/${userId}`, { role: newRole });

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const pendingUsers = totalUsers - activeUsers;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <FiUsers className="w-4 h-4 text-slate-500" />
            User Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review user account permissions and manage role authorizations.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Soothing Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Total Accounts
          </span>
          <span className="text-2xl font-bold text-slate-800 mt-1 block">
            {totalUsers}
          </span>
        </div>

        <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
            Active Access
          </span>
          <span className="text-2xl font-bold text-emerald-800 mt-1 block">
            {activeUsers}
          </span>
        </div>

        <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
            Pending Activation
          </span>
          <span className="text-2xl font-bold text-amber-800 mt-1 block">
            {pendingUsers}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Clean Aesthetic Table */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <span className="loading loading-spinner loading-sm"></span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.image ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          alt={user.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <span className="font-semibold text-slate-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {user.email}
                    </td>

                    {/* Role Select */}
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="bg-slate-100/80 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        <option value="MODERATOR">Moderator</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100/80 text-emerald-800 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                          <FiCheck className="w-3 h-3 text-emerald-600" />{" "}
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100/80 text-amber-800 text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                          <FiClock className="w-3 h-3 text-amber-600" />{" "}
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          handleStatusToggle(user.id, user.isActive)
                        }
                        disabled={updatingId === user.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          user.isActive
                            ? "text-rose-600 hover:bg-rose-50"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <FiUserX className="w-3 h-3" /> Deactivate
                          </>
                        ) : (
                          <>
                            <FiUserCheck className="w-3 h-3" /> Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

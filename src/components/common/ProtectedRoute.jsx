import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSession } from "../../lib/auth-client";

export default function ProtectedRoute({ allowedRoles }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!session.user.isActive) {
    return <Navigate to="/inactive" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <Navigate to="/inventory" replace />;
  }

  return <Outlet />;
}

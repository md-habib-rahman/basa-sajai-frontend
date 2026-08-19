import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

// Auth Pages
import Login from "./pages/Login";
import InactiveAccount from "./pages/InactiveAccount";

// Layout & Protection Guards
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Module Pages
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Investments from "./pages/Investments";
import AdminUsers from "./pages/AdminUsers";
import RoiDashboard from "./pages/RoiDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Pending Approval Notice Page */}
        <Route path="/inactive" element={<InactiveAccount />} />

        {/* Protected App Routes (Requires Active User Session) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/inventory" replace />} />

            {/* Accessible to All Active Users */}
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/roi" element={<RoiDashboard />} />
            {/* Admin & Super Admin Restricted Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />
              }
            >
              <Route path="/investments" element={<Investments />} />
              <Route path="/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

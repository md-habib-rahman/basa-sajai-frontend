import React from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Login from "./pages/Login";
import InactiveAccount from "./pages/InactiveAccount";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Investments from "./pages/Investments";
import AdminUsers from "./pages/AdminUsers";
import RoiDashboard from "./pages/RoiDashboard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/inactive",
    element: <InactiveAccount />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Navigate to="/inventory" replace /> },
          { path: "/inventory", element: <Inventory /> },
          { path: "/orders", element: <Orders /> },
          {
            element: <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />,
            children: [
              { path: "/investments", element: <Investments /> },
              { path: "/roi", element: <RoiDashboard /> },
              { path: "/users", element: <AdminUsers /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

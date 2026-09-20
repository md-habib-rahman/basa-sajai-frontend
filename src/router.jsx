import React from "react";
import { createBrowserRouter, Navigate } from "react-router";

import Login from "./pages/Login";
import InactiveAccount from "./pages/InactiveAccount";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Inventory from "./pages/Inventory";

import Investments from "./pages/Investments";
import AdminUsers from "./pages/AdminUsers";
import RoiDashboard from "./pages/RoiDashboard";
import Bank from "./pages/Bank";
import AppLayout1 from "./components/layout/AppLayout1";
import Orders from "./pages/Orders";

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
        element: <AppLayout1 />,
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
              { path: "/bank", element: <Bank /> },
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

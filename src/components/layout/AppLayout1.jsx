import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { authClient, useSession } from "../../lib/auth-client";
import {
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";

export default function AppLayout1() {
  const { data: session } = useSession();
  const navigate = useNavigate();

  // Collapsible state (collapsed vs expanded sidebar)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer slide-over state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const role = session?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const navItems = [
    { path: "/inventory", label: "Inventory & Costing", icon: FiBox },
    { path: "/orders", label: "Order Management", icon: FiShoppingCart },
    { path: "/bank", label: "Bank & Treasury", icon: FiDollarSign },
    { path: "/investments", label: "Investment Ledger", icon: FiCreditCard },
    { path: "/roi", label: "ROI Analytics", icon: FiTrendingUp },
    ...(isAdmin
      ? [{ path: "/users", label: "User Admin", icon: FiUsers }]
      : []),
  ];

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800">
      {/* Top Bar / Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 md:px-5 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Open Drawer"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <FiChevronLeft className="w-5 h-5" />
            )}
          </button>

          <span className="font-extrabold text-base tracking-tight text-slate-900">
            BASA SAJAI
          </span>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/60">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-4 h-4 text-slate-500" />
            )}
            <span className="font-medium hidden sm:inline">
              {session?.user?.name || "User"}
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold uppercase">
              {role || "MODERATOR"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body - Sticky Sidebar + Full Width Content */}
      <div className="flex flex-1 relative w-full">
        {/* Backdrop for Mobile Overlay Drawer */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Navigation Sidebar */}
        <aside
          className={`
            fixed md:sticky top-[49px] z-40 h-[calc(100vh-49px)] bg-white border-r border-slate-200/80 transition-all duration-300 flex flex-col justify-between shrink-0
            ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
            ${isCollapsed ? "md:w-16" : "md:w-60"}
          `}
        >
          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all
                    ${
                      isActive
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-opacity duration-200 ${
                      isCollapsed ? "md:hidden" : "block"
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer Branding inside Sidebar */}
          <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            {!isCollapsed ? "Basa Sajai Business OS" : "BS"}
          </div>
        </aside>

        {/* Full Width Main Content Page */}
        <main className="flex-1 min-w-0 p-4 md:p-5 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { useSession, signOut } from "../../lib/auth-client";
import {
  FiBox,
  FiShoppingCart,
  FiCreditCard,
  FiUsers,
  FiLogOut,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiDollarSign,
} from "react-icons/fi";

export default function AppLayout() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const navItems = [
    {
      path: "/inventory",
      label: "Inventory & Costing",
      icon: FiBox,
    },
    {
      path: "/orders",
      label: "Order Management",
      icon: FiShoppingCart,
    },
    ...(isAdmin
      ? [
          {
            path: "/users",
            label: "User Admin",
            icon: FiUsers,
          },
          { path: "/bank", label: "Bank & Treasury", icon: FiDollarSign },
          {
            path: "/investments",
            label: "Investment Ledger",
            icon: FiCreditCard,
          },
          {
            path: "/roi",
            label: "ROI Analytics",
            icon: FiTrendingUp,
          },
        ]
      : []),
  ];

  // Close drawer with Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Prevent background scrolling while drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Menu Button */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="shrink-0 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Open menu"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
            >
              <FiMenu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="bg-slate-100 rounded-xl shadow-xs shrink-0 overflow-hidden">
              <img
                src="/Basa-Sajai-Logo-1-02.png"
                alt="Basa Sajai"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>

            {/* Workspace Label */}
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-wider uppercase whitespace-nowrap">
                Internal Workspace
              </span>
            </div>
          </div>

          {/* User Area */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2 bg-slate-100/80 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 rounded-full border border-slate-200/60">
              <img
                src={
                  user?.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "User"}`
                }
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />

              {/* Hide name on very small screens */}
              <span className="hidden sm:block text-xs font-medium text-slate-700 max-w-[120px] truncate">
                {user?.name}
              </span>

              {/* Hide role on very small screens */}
              <span className="hidden md:inline-flex badge badge-xs bg-slate-200 border-none text-slate-600 font-semibold uppercase text-[9px] px-1.5 py-0.5">
                {user?.role?.replace("_", " ")}
              </span>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          DRAWER OVERLAY
      ========================================================== */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* =========================================================
          APP DRAWER
      ========================================================== */}
      <aside
        className={`
          fixed
          top-0
          left-0
          bottom-0
          z-[60]
          w-[85vw]
          max-w-[320px]
          sm:w-[280px]
          bg-white
          border-r
          border-slate-200
          shadow-2xl
          flex
          flex-col
          transition-transform
          duration-300
          ease-out
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!isDrawerOpen}
      >
        {/* Drawer Header */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-slate-100 rounded-xl overflow-hidden shrink-0">
              <img
                src="/Basa-Sajai-Logo-1-02.png"
                alt="Basa Sajai"
                className="w-10 h-10 object-contain"
              />
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                Basa Sajai
              </div>

              <div className="text-[9px] text-slate-400 uppercase tracking-wider truncate">
                Internal Workspace
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="shrink-0 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Close menu"
            aria-label="Close menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* =======================================================
            NAVIGATION
        ======================================================== */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
            Modules
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeDrawer}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />

                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* =======================================================
            DRAWER FOOTER
        ======================================================== */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              closeDrawer();
              signOut();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN WORKSPACE
      ========================================================== */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 lg:p-6">
        <main className="min-w-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs min-h-[640px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import React from "react";
import { NavLink, Outlet } from "react-router";
import { useSession, signOut } from "../../lib/auth-client";
import {
  FiShoppingBag,
  FiBox,
  FiShoppingCart,
  FiCreditCard,
  FiUsers,
  FiLogOut,
  FiTrendingUp,
} from "react-icons/fi";

export default function AppLayout() {
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const navItems = [
    { path: "/inventory", label: "Inventory & Costing", icon: FiBox },
    { path: "/orders", label: "Order Management", icon: FiShoppingCart }, // <--- ADD THIS
    ...(isAdmin
      ? [
          { path: "/users", label: "User Admin", icon: FiUsers },
          {
            path: "/investments",
            label: "Investment Ledger",
            icon: FiCreditCard,
          },
          { path: "/roi", label: "ROI Analytics", icon: FiTrendingUp },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-800">
      {/* Top Floating Glass Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className=" bg-slate-100 text-white rounded-xl shadow-xs">
              {/* <FiShoppingBag className="w-4 h-4" /> */}
              <img
                src="/Basa-Sajai-Logo-1-02.png"
                alt=""
                className="w-15 h-15"
              />
            </div>
            <div>
              {/* <span className="font-semibold text-sm tracking-tight text-slate-900 block leading-none">
                Basa Sajai
              </span> */}
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Internal Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-100/80 pl-2 pr-3 py-1 rounded-full border border-slate-200/60">
              <img
                src={
                  user?.image ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`
                }
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover border border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">
                {user?.name}
              </span>
              <span className="badge badge-xs bg-slate-200 border-none text-slate-600 font-semibold uppercase text-[9px] px-1.5 py-0.5">
                {user?.role?.replace("_", " ")}
              </span>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col sm:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full sm:w-60 flex-none">
          <nav className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-900 text-white font-medium shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Card Container */}
        <main className="flex-1 min-w-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs min-h-[640px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

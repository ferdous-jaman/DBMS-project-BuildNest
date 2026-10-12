"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdConstruction,
  MdDashboard,
  MdApartment,
  MdPeople,
  MdInventory,
  MdPayments,
  MdGavel,
  MdWarning,
  MdPrecisionManufacturing,
  MdBusiness,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";

const navItems = [
  {
    href: "/dashboard",
    icon: MdDashboard,
    label: "Dashboard",
    description: "Overview & Stats",
  },
  {
    href: "/buildings",
    icon: MdApartment,
    label: "Buildings",
    description: "Projects & Stages",
  },
  {
    href: "/owners",
    icon: MdBusiness,
    label: "Owners",
    description: "Owner Management",
  },
  {
    href: "/workers",
    icon: MdPeople,
    label: "Workers",
    description: "Workforce & Attendance",
  },
  {
    href: "/materials",
    icon: MdInventory,
    label: "Materials",
    description: "Stock & Orders",
  },
  {
    href: "/payments",
    icon: MdPayments,
    label: "Payments",
    description: "Worker & Owner Payments",
  },
  {
    href: "/contracts",
    icon: MdGavel,
    label: "Contracts",
    description: "Legal Agreements",
  },
  {
    href: "/equipment",
    icon: MdPrecisionManufacturing,
    label: "Equipment",
    description: "Machinery & Tools",
  },
  {
    href: "/safety",
    icon: MdWarning,
    label: "Safety",
    description: "Incidents & Reports",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/login", { method: "DELETE" });
    } catch {
      // ignore
    }
    document.cookie = "session=; Max-Age=0; path=/";
    toast.success("Logged out successfully");
    router.push("/auth/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-700 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <MdConstruction className="text-xl text-dark-950" />
            </div>
            <div>
              <h1 className="text-base font-bold text-dark-50">BuildNest</h1>
              <p className="text-xs text-brand-400">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <Icon
                  className={`text-lg flex-shrink-0 ${
                    active ? "text-brand-400" : "text-dark-400"
                  }`}
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{item.label}</div>
                  <div className="text-xs text-dark-500 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-brand-400 text-sm font-bold">A</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark-100 truncate">
                Admin
              </p>
              <p className="text-xs text-dark-500">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 text-sm font-medium"
          >
            <MdLogout className="text-lg" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-dark-900 border-b border-dark-700 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-dark-300 hover:text-dark-100"
          >
            <MdMenu className="text-2xl" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-dark-100 capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h2>
            <p className="text-xs text-dark-500">
              BuildNest Construction Management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-dark-400">System Online</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-dark-950">
          {children}
        </main>
      </div>
    </div>
  );
}

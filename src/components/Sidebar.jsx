import React from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiShoppingCart, FiBox, FiBarChart2, FiSettings } from "react-icons/fi";
import { FaStore } from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { id: "transaksi", path: "/transaksi", icon: <FiShoppingCart />, label: "Transaksi" },
    { id: "produk", path: "/produk", icon: <FiBox />, label: "Produk" },
    { id: "laporan", path: "/laporan", icon: <FiBarChart2 />, label: "Laporan" },
    { id: "pengaturan", path: "/pengaturan", icon: <FiSettings />, label: "Pengaturan" },
  ];

  // Komponen Logo agar bisa digunakan berulang (Reusable)
  const LogoWarung = () => (
    <div className="flex flex-col items-center gap-1 group cursor-default select-none">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none transition-all duration-300 group-hover:rotate-6 group-active:scale-95">
        <FaStore className="text-white text-2xl md:text-3xl" />
      </div>
      <div className="flex flex-col items-center leading-none">
        <span className="text-[9px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-tighter uppercase">
         
        </span>
        <span className="text-[9px] md:text-[10px] font-black text-slate-800 dark:text-white tracking-tighter uppercase">
         
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= HEADER KHUSUS HP (TOP BAR) ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-[100] px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoWarung />
          <h1 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight">
            Warung Digital
          </h1>
        </div>
        {/* Bisa ditambah tombol profile atau notifikasi di sini */}
      </div>

      {/* ================= DESKTOP SIDEBAR (LAPTOP) ================= */}
      <aside className="hidden md:flex w-28 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col items-center py-10 gap-12 sticky top-0 h-screen z-50 transition-colors">
        <LogoWarung />

        <nav className="flex flex-col gap-4 w-full px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex flex-col items-center justify-center py-4 w-full rounded-[24px] transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <span className="text-2xl mb-1.5">{item.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tight">{item.label}</span>
              <span className="absolute -right-3 w-1.5 h-10 bg-emerald-500 rounded-l-full opacity-0 group-[.active]:opacity-100 transition-all duration-300" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (HP) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-2 py-3 flex justify-around items-center z-[100] shadow-lg">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center flex-1 py-1 px-2 transition-all ${
                isActive ? "text-emerald-600 dark:text-emerald-400 scale-110" : "text-slate-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                <div className={`w-1 h-1 rounded-full bg-emerald-500 mt-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
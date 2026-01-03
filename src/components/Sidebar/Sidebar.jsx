import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiHome, FiBox, FiActivity, FiShoppingCart, FiSettings 
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion"; // AnimatePresence dihapus untuk memperbaiki error ESLint
import { auth } from "../../firebase/config";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const menuItems = [
    { path: "/dashboard", icon: <FiHome />, label: "Beranda" },
    { path: "/produk", icon: <FiBox />, label: "Produk" },
    { path: "/transaksi", icon: <FiShoppingCart />, label: "Kasir" },
    { path: "/laporan", icon: <FiActivity />, label: "Laporan" },
    { path: "/settings", icon: <FiSettings />, label: "Setelan" },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR (LAPTOP) --- */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-[#020617] border-r border-slate-100 dark:border-slate-800 flex-col py-8 px-6 sticky top-0 h-screen z-50">
        
        {/* BRANDING */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
            <FaStore className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-sm font-black dark:text-white uppercase tracking-tighter leading-none">Warung</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Digital</p>
          </div>
        </div>

        {/* MENU NAVIGASI DESKTOP */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-500 font-black" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <span className={`text-xl ${isActive ? "scale-110" : "group-hover:scale-110 transition-transform"}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] uppercase tracking-widest font-bold">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="activeDesk" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* USER PROFILE FOOTER - DISESUAIKAN DENGAN LOGIN */}
        <div 
          onClick={() => navigate('/settings')}
          className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center gap-3 cursor-pointer group p-2 rounded-2xl transition-all"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-500 transition-all" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center font-black text-[10px] text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              {getInitials(user?.displayName || user?.email)}
            </div>
          )}
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-[10px] font-black dark:text-white uppercase truncate">
              {user?.displayName || "Admin User"}
            </p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter truncate">
              Administrator
            </p>
          </div>
        </div>
      </aside>

      {/* --- MOBILE NAVIGATION (HP) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#020617]/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-2 py-3 z-[100] flex justify-around items-center">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-[64px] gap-1 transition-all ${
                isActive ? "text-emerald-500" : "text-slate-400"
              }`}
            >
              <div className="relative">
                <span className={`text-2xl transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDotMobile"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" 
                  />
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
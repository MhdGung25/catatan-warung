import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiHome, FiShoppingCart, FiBox, FiBarChart2, FiSettings, FiUser } from "react-icons/fi"; // Tambah FiUser untuk fallback
import { FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar() {
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);

  // Ambil foto profil dari localStorage saat komponen mount
  useEffect(() => {
    const savedImage = localStorage.getItem("warung_profile_image");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [location]); // Re-check setiap pindah halaman agar foto terupdate jika baru diganti

  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    { id: "transaksi", path: "/transaksi", icon: <FiShoppingCart />, label: "Transaksi" },
    { id: "produk", path: "/produk", icon: <FiBox />, label: "Produk" },
    { id: "laporan", path: "/laporan", icon: <FiBarChart2 />, label: "Laporan" },
    { id: "pengaturan", path: "/pengaturan", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <>
      {/* TOP BAR (MOBILE) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-[150] px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <FaStore className="text-white text-lg" />
          </div>
          <h1 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Warung <span className="text-emerald-600">Digital</span>
          </h1>
        </div>

        {/* --- BAGIAN FOTO PROFIL --- */}
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-slate-400" size={16} />
          )}
        </div>
      </div>

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex w-24 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col items-center py-8 sticky top-0 h-screen z-50 transition-colors">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mb-12">
          <FaStore className="text-white text-2xl" />
        </div>

        <nav className="flex flex-col gap-6 w-full px-3 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex flex-col items-center justify-center py-4 w-full rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
              {location.pathname === item.path && (
                <motion.div layoutId="activeSide" className="absolute -right-3 w-1.5 h-10 bg-emerald-500 rounded-l-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* Opsional: Tampilkan foto profil juga di bawah sidebar desktop */}
        <div className="mt-auto mb-4 w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 flex items-center justify-center">
            {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <FiUser className="text-slate-300" />
            )}
        </div>
      </aside>

      {/* FLOATING BOTTOM NAV (MOBILE) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] flex justify-around items-center z-[200] shadow-2xl">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.id} to={item.path} className="relative flex flex-col items-center justify-center flex-1 h-full pt-2">
              <motion.div animate={isActive ? { y: -4 } : { y: 0 }} className={`flex flex-col items-center ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[7px] font-black uppercase tracking-widest mt-1">{item.label}</span>
                <AnimatePresence>
                  {isActive && (
                    <motion.div layoutId="activeTabDot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default Sidebar;
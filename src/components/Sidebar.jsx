import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import { FiHome, FiShoppingCart, FiBox, FiBarChart2, FiSettings, FiUser } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar() {
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);

  // --- LOGIKA SYNC FOTO PROFIL ---
  const updateProfileImage = () => {
    const savedImage = localStorage.getItem("warung_profile_image");
    setProfileImage(savedImage && savedImage !== "" ? savedImage : null);
  };

  useEffect(() => {
    updateProfileImage();
    const handleStorageChange = () => updateProfileImage();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    updateProfileImage();
  }, [location]);

  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: <FiHome />, label: "Beranda" },
    { id: "transaksi", path: "/transaksi", icon: <FiShoppingCart />, label: "Kasir" },
    { id: "produk", path: "/produk", icon: <FiBox />, label: "Produk" },
    { id: "laporan", path: "/laporan", icon: <FiBarChart2 />, label: "Laporan" },
    { id: "pengaturan", path: "/pengaturan", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <>
      {/* TOP BAR (MOBILE) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-[150] px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center shadow-sm">
        
        {/* LOGO MOBILE - Hanya Gambar (Hapus Link) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FaStore className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">
              WARUNG <span className="text-emerald-600">DIGITAL</span>
            </h1>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Point of Sale</span>
          </div>
        </div>

        {/* FOTO PROFIL MOBILE */}
        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-slate-200 dark:to-slate-700 shadow-md flex items-center justify-center overflow-hidden transition-all duration-500">
          <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <motion.img 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                src={profileImage} 
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser className="text-slate-400" size={18} />
            )}
          </div>
        </div>
      </div>

      {/* --- SIDEBAR DESKTOP --- */}
      <aside className="hidden md:flex w-28 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/50 flex-col items-center py-10 sticky top-0 h-screen z-50 transition-colors">
        
        {/* LOGO DESKTOP - Hanya Gambar (Hapus Link & cursor-pointer) */}
        <motion.div 
          className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-14 relative"
        >
          <FaStore className="text-white text-2xl relative z-10" />
        </motion.div>

        {/* NAVIGATION NAV */}
        <nav className="flex flex-col gap-4 w-full px-4 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex flex-col items-center justify-center py-5 w-full rounded-[1.8rem] transition-all duration-500 overflow-hidden ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-emerald-500"
                }`
              }
            >
              <span className="text-2xl mb-1 relative z-10">{item.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-widest relative z-10 scale-90">{item.label}</span>
              
              {/* Cek status aktif menggunakan location.pathname untuk menghindari error isActive */}
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="activeSideBarEffect" 
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* PROFILE DESKTOP */}
        <div className="mt-auto mb-2 flex flex-col items-center gap-4">
            <div className="w-14 h-14 p-1 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center transition-all duration-500 shadow-sm">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {profileImage ? (
                    <motion.img 
                      initial={{ scale: 1.2, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      src={profileImage} 
                      className="w-full h-full object-cover" 
                    />
                ) : (
                    <FiUser className="text-slate-300 dark:text-slate-600" size={24} />
                )}
              </div>
            </div>
            <div className="h-1 w-8 bg-slate-100 dark:bg-slate-800 rounded-full mb-4" />
        </div>
      </aside>

      {/* FLOATING BOTTOM NAV (MOBILE) */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2.5rem] flex justify-around items-center z-[200]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.id} to={item.path} className="relative flex flex-col items-center justify-center flex-1 h-full">
              <motion.div 
                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }} 
                className={`flex flex-col items-center transition-colors duration-300 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-500 ${isActive ? "bg-emerald-500/10 mb-1" : "bg-transparent"}`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                  {item.label}
                </span>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabPill" 
                      initial={{ opacity: 0, width: 0 }} 
                      animate={{ opacity: 1, width: 20 }} 
                      exit={{ opacity: 0, width: 0 }} 
                      className="absolute -bottom-3 h-1 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,1)]" 
                    />
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
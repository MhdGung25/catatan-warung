import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiShoppingCart, FiBox, FiBarChart2, FiSettings, FiUser 
} from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";

import useProfileImage from "./useProfileImage"; 
import SidebarMenu from "./SidebarMenu";
import MobileTopBar from "./MobileTopBar";
import MobileBottomNav from "./MobileBottomNav";

export default function Sidebar() {
  const navigate = useNavigate();
  const profileImage = useProfileImage(); 

  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: <FiHome />, label: "Beranda" },
    { id: "transaksi", path: "/transaksi", icon: <FiShoppingCart />, label: "Kasir" },
    { id: "produk", path: "/produk", icon: <FiBox />, label: "Produk" },
    { id: "laporan", path: "/laporan", icon: <FiBarChart2 />, label: "Laporan" },
    { id: "pengaturan", path: "/pengaturan", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <>
      {/* 1. TOP BAR (MOBILE) */}
      <MobileTopBar />

      {/* 2. SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex w-28 bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800 flex-col items-center py-10 sticky top-0 h-screen z-50 transition-colors">
        
        {/* LOGO WARUNG (Sekarang Bisa Dipencet ke Dashboard) */}
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/dashboard')}
          className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-14 relative cursor-pointer group"
        >
          <FaStore className="text-white text-2xl group-hover:scale-110 transition-transform" />
        </motion.div>

        {/* Menu Navigasi Utama */}
        <SidebarMenu menuItems={menuItems} />

        {/* PROFILE DESKTOP */}
        <div className="mt-auto mb-2 flex flex-col items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pengaturan')}
            className="w-14 h-14 p-1 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center transition-all shadow-sm group"
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {profileImage ? (
                  <img src={profileImage} className="w-full h-full object-cover" alt="User Profile" />
              ) : (
                  <FiUser className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" size={24} />
              )}
            </div>
          </motion.button>
          <div className="h-1 w-8 bg-slate-100 dark:bg-slate-800 rounded-full mb-4" />
        </div>
      </aside>

      {/* 3. BOTTOM NAV (MOBILE) */}
      <MobileBottomNav menuItems={menuItems} />
    </>
  );
}
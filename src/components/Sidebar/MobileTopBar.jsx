import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiUser } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useProfileImage from "./useProfileImage";

export default function MobileTopBar() {
  const navigate = useNavigate();
  const profileImage = useProfileImage();
  
  // State untuk mengontrol muncul/hilangnya badge notifikasi
  const [hasNewNotif, setHasNewNotif] = useState(false);

  // Simulasi: Cek apakah ada transaksi baru (misal dari localStorage)
  useEffect(() => {
    const checkNotif = () => {
      const isRead = localStorage.getItem("notif_read") === "true";
      setHasNewNotif(!isRead);
    };

    checkNotif();
    // Berjalan setiap kali komponen mount atau tab difokuskan kembali
    window.addEventListener('focus', checkNotif);
    return () => window.removeEventListener('focus', checkNotif);
  }, []);

  const handleNotifClick = () => {
    // 1. Set status sudah dibaca
    localStorage.setItem("notif_read", "true");
    setHasNewNotif(false);
    
    // 2. Arahkan ke halaman Laporan (Aktivitas terbaru)
    navigate('/laporan');
  };

  return (
    <div className="md:hidden fixed top-0 inset-x-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-[150] px-6 py-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center shadow-sm">
      
      {/* SISI KIRI: Logo & Nama (Klik ke Dashboard) */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <FaStore className="text-white text-lg" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">
            WARUNG <span className="text-emerald-600">DIGITAL</span>
          </h1>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Official Store</span>
        </div>
      </motion.div>

      {/* SISI KANAN: Notifikasi & Profile */}
      <div className="flex items-center gap-3">
        {/* Ikon Notifikasi */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={handleNotifClick}
          className="relative w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
        >
          <FiBell size={20} />
          
          {/* Badge Merah: Muncul hanya jika hasNewNotif true */}
          <AnimatePresence>
            {hasNewNotif && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Ikon Profil */}
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={() => navigate('/pengaturan')}
          className="w-10 h-10 rounded-xl border-2 border-emerald-500/20 p-0.5 overflow-hidden bg-white dark:bg-slate-900"
        >
          {profileImage ? (
            <img src={profileImage} className="w-full h-full object-cover rounded-lg" alt="User" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiUser className="text-slate-400" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import useProfileImage from "./useProfileImage";

export default function MobileTopBar() {
  const navigate = useNavigate();
  const profileImage = useProfileImage();

  return (
    <div className="md:hidden fixed top-0 inset-x-0 bg-white dark:bg-[#0f172a] z-[150] px-6 py-4 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center transition-colors">
      
      {/* SISI KIRI: Brand & Logo sesuai Desain Sidebar Baru */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-100 dark:shadow-none">
          <FaStore className="text-white text-base" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium leading-none mb-0.5">Warung Rakyat</span>
          <h1 className="text-sm font-bold text-slate-800 dark:text-white leading-none">
            Hallo, <span className="text-emerald-600 font-extrabold">Ester</span>
          </h1>
        </div>
      </motion.div>

      {/* SISI KANAN: Ikon Sesuai Gambar Referensi (Settings & Logout) */}
      <div className="flex items-center gap-2">
        {/* Tombol Pengaturan */}
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={() => navigate('/pengaturan')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <FiSettings size={18} />
        </motion.button>

        {/* Tombol Logout (Sesuai ikon pintu keluar di gambar) */}
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            // Logika logout Anda di sini
            console.log("User Logout");
          }}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
        >
          <FiLogOut size={18} />
        </motion.button>

        {/* Avatar Kecil (Opsional: Memberi sentuhan personal) */}
        <div className="ml-1 w-8 h-8 rounded-full border-2 border-emerald-50 bg-slate-100 overflow-hidden">
           {profileImage ? (
             <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
           ) : (
             <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-600 text-xs font-bold">
               E
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { FiUser, FiMoon, FiSun, FiLogOut, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function Settings({ user, onLogout, darkMode, setDarkMode }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        await onLogout();
      }
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
      alert("Gagal logout. Coba lagi.");
      setIsLoggingOut(false);
    }
  };

  // Nama user dari registrasi (displayName) atau potong email
  const userName = user?.displayName || user?.email?.split("@")[0] || "Pemilik Warung";

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 pt-24 md:pt-8 md:p-8 pb-32 animate-in fade-in zoom-in-95 duration-500">
      
      {/* PROFIL PENGGUNA */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 text-emerald-600 flex items-center justify-center rounded-3xl mx-auto mb-4 border border-slate-100 dark:border-slate-700 shadow-inner">
          <FiUser size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase">
          {userName}
        </h3>
        <p className="text-slate-400 text-xs font-bold mt-1">
          {user?.email || "admin@warungdigital.com"}
        </p>
      </div>

      {/* PENGATURAN APLIKASI */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <FiInfo className="text-emerald-500" /> {/* FiInfo DIGUNAKAN DI SINI */}
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Sistem Warung Digital
          </h4>
        </div>

        {/* Toggle Dark Mode */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
              {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />} {/* FiMoon & FiSun DIGUNAKAN DI SINI */}
            </div>
            <div>
              <p className="font-black text-slate-800 dark:text-white text-sm">Mode Tampilan</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{darkMode ? "Gelap" : "Terang"}</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 flex items-center rounded-full px-1 transition-all ${
              darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"
            }`}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* LOGOUT SECTION */}
        <div className="pt-4">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)} // setShowConfirm DIGUNAKAN DI SINI
              className="w-full p-5 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3"
            >
              <FiLogOut /> Keluar dari Aplikasi {/* FiLogOut DIGUNAKAN DI SINI */}
            </button>
          ) : (
            <div className="space-y-4 p-6 bg-red-50 dark:bg-red-900/20 rounded-[24px]">
              <p className="text-center text-sm font-black text-red-600 dark:text-red-400 uppercase">
                Konfirmasi Keluar?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogoutConfirm} // handleLogoutConfirm DIGUNAKAN DI SINI
                  disabled={isLoggingOut} // isLoggingOut DIGUNAKAN DI SINI
                  className="flex-1 p-4 bg-red-500 text-white rounded-xl font-black text-xs uppercase"
                >
                  {isLoggingOut ? "Proses..." : "Ya, Keluar"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 p-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl font-black text-xs uppercase border"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
import React, { useState, useEffect } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiRefreshCw, FiSettings, FiLayout,
  FiUser, FiLock, FiAlertCircle, FiX 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- PERBAIKAN IMPORT MODUL ---
// Karena file ini berada di src/pages/settings/SettingsPage.jsx
// Maka file lainnya dipanggil langsung dari folder yang sama (.)
import GeneralSettings from "./GeneralSettings";
import PaymentSettings from "./PaymentSettings";
import CashierSettings from "./CashierSettings";
import StockSettings from "./StockSettings";
import ReceiptSettings from "./ReceiptSettings";

// --- PERBAIKAN IMPORT HOOK ---
// Keluar dua tingkat (../../) untuk mencapai folder src/hooks
import useSettings from "../../hooks/useSettings";

function Settings({ onLogout, darkMode, setDarkMode, setIsCropping }) {
  const navigate = useNavigate();
  const { isLoaded } = useSettings();
  
  const [activeTab, setActiveTab] = useState("general");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Sinkronisasi state modal ke Parent (App.js) jika diperlukan
  useEffect(() => {
    if (setIsCropping) {
      setIsCropping(showConfirmLogout || showPasswordModal);
    }
  }, [showConfirmLogout, showPasswordModal, setIsCropping]);

  // Tab Navigation Items
  const tabs = [
    { id: "general", label: "Profil Toko", icon: FiUser },
    { id: "cashier", label: "Sistem Kasir", icon: FiLayout },
    { id: "payment", label: "Pembayaran", icon: FiSettings },
    { id: "stock", label: "Stok Barang", icon: FiAlertCircle },
    { id: "receipt", label: "Format Struk", icon: FiSettings },
  ];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-24 pt-24 md:pt-32 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
                Konfigurasi <span className="text-emerald-500">Sistem</span>
              </h1>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
              <FiRefreshCw className="text-emerald-500 animate-spin" size={12} /> Auto-Sync Cloud Aktif
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-all"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button 
              onClick={() => setShowConfirmLogout(true)}
              className="flex items-center gap-3 bg-rose-500/10 text-rose-500 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
            >
              <FiLogOut size={16} /> Keluar Sesi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SIDEBAR NAV (KIRI) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="sticky top-32">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Menu Utama</p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                    activeTab === tab.id 
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 translate-x-2" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:translate-x-1"
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="uppercase tracking-tight text-[11px] font-black">{tab.label}</span>
                </button>
              ))}

              <div className="mt-10 p-6 rounded-[2rem] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white relative overflow-hidden shadow-xl">
                <FiSettings className="absolute -bottom-4 -right-4 text-white/20" size={100} />
                <p className="relative z-10 font-black text-xs uppercase tracking-widest mb-1">Status Lisensi</p>
                <p className="relative z-10 text-[10px] opacity-80 uppercase font-bold">Versi Pro - 2.0.4</p>
              </div>
            </div>
          </div>

          {/* CONTENT AREA (KANAN) */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[3.5rem] border dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "general" && <GeneralSettings setIsCropping={setIsCropping} />}
                  {activeTab === "payment" && <PaymentSettings />}
                  {activeTab === "cashier" && <CashierSettings />}
                  {activeTab === "stock" && <StockSettings />}
                  {activeTab === "receipt" && <ReceiptSettings />}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="mt-8 flex justify-center">
               <button 
                onClick={() => setShowPasswordModal(true)}
                className="text-slate-400 dark:text-slate-600 hover:text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
               >
                <FiLock /> Keamanan & Password
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[1120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-[#0f172a] p-12 rounded-[4rem] text-center shadow-2xl w-full max-w-sm border dark:border-slate-800">
              <FiLogOut className="text-rose-500 text-5xl mx-auto mb-6" />
              <h4 className="text-slate-800 dark:text-white text-xl font-black uppercase tracking-tighter">Akhiri Sesi?</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Anda harus login kembali untuk akses data</p>
              <div className="flex flex-col gap-3 mt-10">
                <button onClick={() => { onLogout(); navigate("/login"); }} className="w-full py-5 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-500/30 transition-transform active:scale-95">Ya, Logout</button>
                <button onClick={() => setShowConfirmLogout(false)} className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200">Batalkan</button>
              </div>
            </motion.div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-[1120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-[#0f172a] p-10 rounded-[3.5rem] w-full max-w-sm shadow-2xl border dark:border-slate-800">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black dark:text-white uppercase text-xs tracking-widest">Ganti Password</h4>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-rose-500"><FiX size={20}/></button>
              </div>
              <div className="space-y-4">
                <input type="password" placeholder="Password Lama" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm dark:text-white" />
                <input type="password" placeholder="Password Baru" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm dark:text-white" />
                <button onClick={() => setShowPasswordModal(false)} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/30 active:scale-95 transition-all">Update Keamanan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
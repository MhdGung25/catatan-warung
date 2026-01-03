import React, { useState } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiLayout,
  FiUser, FiCheck, FiInfo, FiCreditCard 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- SUB-KOMPONEN PROFIL WARUNG ---
const GeneralTab = () => {
  const [data, setData] = useState({
    shopName: localStorage.getItem("shopName") || "Warung Digital",
    address: localStorage.getItem("shopAddress") || "Jl. Ekonomi No. 123",
    phone: localStorage.getItem("shopPhone") || "08123456789"
  });

  const handleChange = (key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
    localStorage.setItem(key, val);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-emerald-500 mb-2">
        <FiInfo size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Informasi Publik</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nama Bisnis</label>
          <input 
            type="text"
            value={data.shopName}
            onChange={(e) => handleChange("shopName", e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 focus:border-emerald-500 outline-none font-bold text-slate-700 dark:text-white transition-all text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp</label>
          <input 
            type="text"
            value={data.phone}
            onChange={(e) => handleChange("shopPhone", e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 focus:border-emerald-500 outline-none font-bold text-slate-700 dark:text-white transition-all text-sm"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alamat di Struk</label>
        <textarea 
          value={data.address}
          onChange={(e) => handleChange("shopAddress", e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 focus:border-emerald-500 outline-none font-bold text-slate-700 dark:text-white transition-all h-28 resize-none text-sm"
        />
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function SettingsPage({ onLogout, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem("activePayments");
    return saved ? JSON.parse(saved) : { Tunai: true, QRIS: true, Transfer: true };
  });

  const togglePayment = (method) => {
    const newData = { ...paymentMethods, [method]: !paymentMethods[method] };
    setPaymentMethods(newData);
    localStorage.setItem("activePayments", JSON.stringify(newData));
    window.dispatchEvent(new Event("storage"));
  };

  const tabs = [
    { id: "general", label: "Profil Warung", icon: FiUser },
    { id: "cashier", label: "Layout Kasir", icon: FiLayout },
    { id: "payment", label: "Metode Bayar", icon: FiCreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] pb-32 pt-10 md:pt-24 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter">
              SET<span className="text-emerald-500">TINGS</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">Konfigurasi Sistem</p>
          </motion.div>

          <div className="flex gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-500 shadow-sm hover:scale-110 transition-all"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button 
              onClick={() => setShowConfirmLogout(true)} 
              className="bg-rose-500 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all"
            >
              <FiLogOut size={16} className="inline mr-2" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center justify-between p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
                  activeTab === t.id 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
                  : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <t.icon size={18} />
                  {t.label}
                </div>
                {/* FiCheck digunakan di sini untuk menandai tab aktif */}
                {activeTab === t.id && <FiCheck size={16} />}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] border dark:border-slate-800 shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && <GeneralTab />}

                {activeTab === "cashier" && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <FiLayout size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                    <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Kustomisasi Layout</h3>
                    <p className="text-slate-500 text-[9px] mt-2 uppercase font-bold tracking-widest italic">Fitur ini akan segera hadir</p>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 mb-6">
                      <FiInfo size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Klik saklar untuk mengaktifkan metode</span>
                    </div>
                    {Object.keys(paymentMethods).map((m) => (
                      <div key={m} className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border dark:border-slate-700/50">
                        <span className="text-xs font-black dark:text-white uppercase tracking-widest">{m}</span>
                        <button 
                          onClick={() => togglePayment(m)} 
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${paymentMethods[m] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${paymentMethods[m] ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL LOGOUT */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[1120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center w-full max-w-sm border dark:border-slate-800">
              <FiLogOut size={32} className="mx-auto mb-4 text-rose-500" />
              <h4 className="dark:text-white font-black uppercase text-sm tracking-tight">Keluar dari Sesi?</h4>
              <p className="text-slate-400 text-[10px] uppercase font-bold mt-2">Pastikan semua data sudah tersimpan.</p>
              <div className="flex flex-col gap-2 mt-8">
                <button onClick={() => {onLogout(); navigate("/login");}} className="py-4 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all">Ya, Logout</button>
                <button onClick={() => setShowConfirmLogout(false)} className="py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batalkan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
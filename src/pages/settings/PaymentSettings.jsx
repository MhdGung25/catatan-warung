import React, { useState, useEffect } from "react";
import { FiSave, FiSmartphone, FiHome, FiCheckCircle, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

function PaymentSettings() {
  // --- STATE UNTUK FORM ---
  const [settings, setSettings] = useState({
    merchant_name: "",
    nmid: "",
    bank_account: "",
  });
  const [saved, setSaved] = useState(false);

  // --- AMBIL DATA SAAT LOAD ---
  useEffect(() => {
    const savedName = localStorage.getItem("merchant_name") || "";
    const savedNmid = localStorage.getItem("nmid") || "";
    const savedBank = localStorage.getItem("bank_account") || "";
    
    setSettings({
      merchant_name: savedName,
      nmid: savedNmid,
      bank_account: savedBank
    });
  }, []);

  // --- SIMPAN KE LOCALSTORAGE ---
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("merchant_name", settings.merchant_name);
    localStorage.setItem("nmid", settings.nmid);
    localStorage.setItem("bank_account", settings.bank_account);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 flex gap-3 items-start">
        <FiInfo className="text-emerald-500 mt-1" size={20} />
        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
          Data yang Anda isi di sini akan muncul otomatis pada kolom <strong>Tujuan Bayar</strong> di halaman transaksi saat pelanggan memilih metode pembayaran QRIS atau Bank.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* --- KONFIGURASI QRIS --- */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 dark:text-white">
            <FiSmartphone className="text-emerald-500" /> Konfigurasi Merchant QRIS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Merchant</label>
              <input 
                type="text"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                placeholder="Contoh: WARUNG MAJU JAYA"
                value={settings.merchant_name}
                onChange={(e) => setSettings({...settings, merchant_name: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ID Terminal (NMID)</label>
              <input 
                type="text"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-mono font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                placeholder="ID102030..."
                value={settings.nmid}
                onChange={(e) => setSettings({...settings, nmid: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* --- KONFIGURASI BANK --- */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 dark:text-white">
            <FiHome className="text-blue-500" /> Konfigurasi Transfer Bank
          </h3>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Detail Rekening</label>
            <input 
              type="text"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-blue-500 transition-all"
              placeholder="Contoh: BCA - 12345678 a/n Nama Anda"
              value={settings.bank_account}
              onChange={(e) => setSettings({...settings, bank_account: e.target.value})}
            />
          </div>
        </div>

        {/* --- BUTTON SIMPAN --- */}
        <button 
          type="submit"
          className={`w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
        >
          {saved ? (
            <><FiCheckCircle size={18} /> Berhasil Disimpan</>
          ) : (
            <><FiSave size={18} /> Simpan Pengaturan</>
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default PaymentSettings;
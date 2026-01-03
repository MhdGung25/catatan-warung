import React, { useState, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiSmartphone, FiCreditCard, FiDollarSign } from 'react-icons/fi'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSummary({ subtotal, selectedMethod, setSelectedMethod, onCheckout, cartLength }) {
  const [activePayments, setActivePayments] = useState({ Tunai: true, Transfer: false, QRIS: false });
  const [paymentDetails, setPaymentDetails] = useState({ qrisDetail: "", transferDetail: "" });

  // Gunakan useCallback agar fungsi tidak dibuat ulang setiap render (menghilangkan warning)
  const syncPaymentSettings = useCallback(() => {
    try {
      const savedActive = JSON.parse(localStorage.getItem("activePayments") || '{"Tunai": true, "Transfer": false, "QRIS": false}');
      const qrisId = localStorage.getItem("qrisDetail") || "";
      const transferId = localStorage.getItem("transferDetail") || "";
      
      setActivePayments(savedActive);
      setPaymentDetails({ qrisDetail: qrisId, transferDetail: transferId });

      // Proteksi: Jika metode yang dipilih di-nonaktifkan di Settings, paksa pindah ke "Tunai"
      if (savedActive && !savedActive[selectedMethod]) {
        setSelectedMethod("Tunai");
      }
    } catch (error) {
      console.error("Error syncing payment settings:", error);
    }
  }, [selectedMethod, setSelectedMethod]);

  useEffect(() => {
    syncPaymentSettings();
    
    // Dengarkan perubahan dari tab Settings (LocalStorage Event)
    window.addEventListener("storage", syncPaymentSettings);
    // Custom event jika perubahan terjadi di tab yang sama
    window.addEventListener("data-updated", syncPaymentSettings);

    return () => {
      window.removeEventListener("storage", syncPaymentSettings);
      window.removeEventListener("data-updated", syncPaymentSettings);
    };
  }, [syncPaymentSettings]);

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border dark:border-slate-800 shadow-xl sticky top-28 transition-all">
      {/* TOTAL TAGIHAN */}
      <div className="mb-8">
        <h3 className="text-emerald-500 font-black uppercase text-[10px] tracking-widest mb-2">Total Tagihan</h3>
        <p className="text-4xl font-black text-slate-800 dark:text-white">
          <span className="text-sm text-slate-400 mr-1 italic">Rp</span>
          {subtotal.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
          Pilih Metode Pembayaran
        </label>
        
        {/* LIST METODE PEMBAYARAN AKTIF */}
        <div className="grid grid-cols-1 gap-2">
          {Object.keys(activePayments).map((method) => {
            // Sembunyikan jika di Settings diset Nonaktif
            if (!activePayments[method]) return null;

            const isActive = selectedMethod === method;
            
            return (
              <motion.button
                whileTap={{ scale: 0.98 }}
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' 
                    : 'border-slate-50 dark:border-slate-800/50 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                {/* ICON DYNAMIC */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                  {method === "QRIS" ? <FiSmartphone size={16}/> : 
                   method === "Transfer" ? <FiCreditCard size={16}/> : 
                   <FiDollarSign size={16}/>}
                </div>

                {/* TEXT DETAIL */}
                <div className="flex-1 text-left">
                   <span className="font-black text-[11px] uppercase tracking-widest block">{method}</span>
                   {isActive && method !== "Tunai" && (
                     <span className="text-[9px] font-bold opacity-80 truncate block mt-0.5">
                       {method === "QRIS" ? paymentDetails.qrisDetail : paymentDetails.transferDetail}
                     </span>
                   )}
                </div>

                {isActive && <FiCheckCircle size={16} className="text-emerald-500" />}
              </motion.button>
            );
          })}
        </div>

        {/* BOX DETAIL KHUSUS QRIS (Muncul Otomatis Saat Dipilih) */}
        <AnimatePresence>
          {selectedMethod === "QRIS" && paymentDetails.qrisDetail && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }} 
              animate={{ height: 'auto', opacity: 1, marginTop: 8 }} 
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl border border-dashed border-emerald-500/30">
                <p className="text-[8px] font-black text-emerald-500 uppercase mb-1 tracking-tighter">Instruksi Pembayaran:</p>
                <p className="text-xs font-black dark:text-white uppercase tracking-tight italic">
                  Tunjukkan QRIS "{paymentDetails.qrisDetail}"
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOMBOL BAYAR */}
        <button 
          onClick={onCheckout}
          disabled={cartLength === 0}
          className={`w-full py-6 rounded-3xl font-black uppercase text-[11px] flex items-center justify-center gap-3 transition-all mt-4 ${
            cartLength === 0 
              ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
              : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95"
          }`}
        >
          <FiCheckCircle size={18} /> SELESAIKAN PESANAN
        </button>
      </div>
    </div>
  );
}
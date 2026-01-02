import React, { useState, useEffect } from "react";
import { 
  FiX, FiSave, FiHash, FiPackage, 
  FiDollarSign, FiLayers, FiAlertCircle 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ open, onClose, onSave, product }) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
    stock: ""
  });

  // Sinkronisasi form saat modal dibuka atau produk berubah
  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        code: `PRD-${Date.now().toString().slice(-6)}`,
        name: "",
        price: "",
        stock: ""
      });
    }
  }, [product, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      alert("⚠️ Mohon lengkapi semua data produk!");
      return;
    }
    onSave(form);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                  <FiPackage size={20} />
                </div>
                <div>
                  <h3 className="font-black dark:text-white uppercase text-xs tracking-widest">
                    {product ? "Edit Informasi" : "Tambah Barang"}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Database Inventaris</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Input Kode SKU */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-1">Kode SKU (Otomatis)</label>
                <div className="relative">
                  <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    readOnly 
                    className="w-full pl-12 p-4 rounded-2xl bg-slate-100 dark:bg-[#020617] dark:text-slate-400 font-mono font-bold outline-none text-xs border border-transparent" 
                    value={form.code} 
                  />
                </div>
              </div>

              {/* Input Nama Barang */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase px-1">Nama Barang</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  placeholder="Contoh: Kopi Sachet..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm uppercase"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Input Harga */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Harga Jual</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-sm transition-all"
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Input Stok */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase px-1">Stok Awal</label>
                  <div className="relative">
                    <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required
                      type="number" 
                      placeholder="0"
                      className="w-full pl-10 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-sm transition-all"
                      value={form.stock} 
                      onChange={e => setForm({...form, stock: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-amber-50 dark:bg-amber-500/5 p-4 rounded-2xl flex gap-3 items-start border border-amber-100 dark:border-amber-500/10">
                <FiAlertCircle className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-bold text-amber-700 dark:text-amber-500/80 leading-relaxed uppercase">
                  Pastikan harga jual sudah termasuk margin keuntungan yang diinginkan agar laporan keuangan akurat.
                </p>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 uppercase text-[10px] tracking-widest mt-2 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <FiSave size={18} /> Simpan ke Etalase
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
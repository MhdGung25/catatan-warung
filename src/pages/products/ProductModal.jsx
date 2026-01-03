import React, { useState, useEffect } from "react";
import { 
  FiX, FiSave, FiHash, FiPackage, 
  FiLayers, FiInfo
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ open, onClose, onSave, product }) {
  const [form, setForm] = useState({
    code: "",
    name: "",
    price: "",
    stock: "",
    category: "Umum"
  });

  // Sinkronisasi data saat modal dibuka atau produk diedit
  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        // Default ID jika tambah baru
        code: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: "",
        price: "",
        stock: "",
        category: "Umum"
      });
    }
  }, [product, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi dasar
    if (!form.name || !form.price || !form.stock) {
      alert("Mohon lengkapi semua data produk!");
      return;
    }

    // PENTING: Konversi harga dan stok ke NUMBER agar bisa dihitung di Kasir
    const finalData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      // Memastikan nama selalu huruf besar agar rapi di tabel
      name: form.name.toUpperCase() 
    };

    onSave(finalData);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center p-4 overflow-y-auto">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white dark:border-slate-800 mt-4 md:mt-0 mb-20 md:mb-0"
          >
            <div className="h-1.5 w-full bg-emerald-500" />

            {/* Header */}
            <div className="p-6 md:p-8 pb-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <FiPackage size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tighter">
                    {product ? "Update" : "Tambah"} <span className="text-emerald-500">Produk</span>
                  </h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Master Data Stok</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-4 space-y-5">
              
              <div className="grid grid-cols-2 gap-3">
                {/* ID Produk / SKU */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase px-1 tracking-widest">ID Produk (SKU)</label>
                  <div className="relative">
                    <FiHash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input 
                      readOnly 
                      title="ID Produk digenerate otomatis"
                      className="w-full pl-9 p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-slate-500 font-mono font-black outline-none text-[10px] border-2 border-transparent cursor-not-allowed" 
                      value={form.code} 
                    />
                  </div>
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase px-1 tracking-widest">Kategori</label>
                  <div className="relative">
                    <select 
                      className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 text-[10px] appearance-none cursor-pointer"
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                    >
                      <option value="Umum">Umum</option>
                      <option value="Makanan">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Sembako">Sembako</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <FiLayers size={10} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Nama Barang */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase px-1 tracking-widest">Nama Barang</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  placeholder="CONTOH: KOPI INDOCAFE..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black outline-none border-2 border-transparent focus:border-emerald-500 text-xs placeholder:text-slate-300 dark:placeholder:text-slate-700 uppercase"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Harga */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase px-1 tracking-widest">Harga Jual (Rp)</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500 font-black text-[10px]">Rp</div>
                    <input 
                      required
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full pl-9 p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-xs"
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Stok */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase px-1 tracking-widest">Jumlah Stok</label>
                  <div className="relative">
                    <FiLayers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input 
                      required
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full pl-9 p-3.5 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-xs"
                      value={form.stock} 
                      onChange={e => setForm({...form, stock: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* Info Sinkronisasi */}
              <div className="bg-emerald-500/5 p-3 rounded-2xl flex gap-3 items-center border border-emerald-500/10">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <FiInfo className="text-emerald-500" size={12} />
                </div>
                <p className="text-[8px] font-bold text-emerald-800 dark:text-emerald-400 leading-tight uppercase tracking-tight">
                  Data ini akan langsung terbaca oleh scanner di halaman kasir/transaksi.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-emerald-500 text-[#020617] font-black rounded-2xl shadow-xl shadow-emerald-500/20 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors"
                >
                  <FiSave size={16} /> Simpan ke Database
                </motion.button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest hover:text-rose-500 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
import React from 'react';
import { FiBox, FiAlertTriangle, FiBell, FiInfo, FiTrendingDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useSettings from '../../hooks/useSettings';

export default function StockSettings() {
  const { settings, update } = useSettings();

  // Handle perubahan angka agar tetap bertipe Number
  const handleThresholdChange = (val) => {
    const num = parseInt(val) || 0;
    update("stock", "lowStockThreshold", num);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Header Halaman */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <FiBox size={20} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
          Manajemen <span className="text-emerald-500">Stok</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* KONTROL PENGATURAN */}
        <div className="space-y-6">
          <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-slate-800 dark:text-white">Ambang Batas Stok Menipis</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Peringatan otomatis saat stok di bawah angka ini</p>
              </div>
            </div>

            <div className="relative mt-4">
              <input
                type="number"
                min="0"
                value={settings.stock.lowStockThreshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 outline-none transition-all font-black text-2xl text-emerald-500 shadow-sm"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-slate-400 tracking-widest pointer-events-none">
                Unit / Pcs
              </span>
            </div>
          </div>

          {/* Opsi Notifikasi */}
          <div className="flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/30">
            <div className="flex gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <FiBell size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-slate-800 dark:text-white">Notifikasi Desktop</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tight">Munculkan popup saat barang hampir habis</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.stock.enableNotifications || false}
                onChange={(e) => update("stock", "enableNotifications", e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* VISUALISASI / EDUKASI */}
        <div className="space-y-4">
          <div className="relative p-8 rounded-[2.5rem] bg-emerald-500 overflow-hidden text-white shadow-xl shadow-emerald-500/20">
            <FiTrendingDown size={120} className="absolute -bottom-6 -right-6 opacity-20 rotate-12" />
            
            <div className="relative z-10">
              <h4 className="font-black text-lg uppercase tracking-tighter leading-tight mb-2">Mengapa ini penting?</h4>
              <p className="text-[11px] opacity-90 leading-relaxed font-medium">
                Sistem akan menandai produk dengan warna <span className="bg-rose-600 px-1 rounded">Merah Menyala</span> pada tabel inventaris jika stoknya sama dengan atau lebih rendah dari <span className="font-black underline">{settings.stock.lowStockThreshold} unit</span>.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '30%' }} 
                    className="h-full bg-white"
                   />
                </div>
              </div>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-widest opacity-70 italic">Status: Perlu Restock Segera</p>
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex gap-3">
            <FiInfo className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-bold uppercase tracking-tight">
              Tips: Atur ambang batas berdasarkan rata-rata waktu pengiriman dari supplier Anda agar stok tidak benar-benar kosong saat proses restock.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
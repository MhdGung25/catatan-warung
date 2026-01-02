import React from 'react';
import { FiShoppingCart, FiAlertCircle, FiZap, FiPrinter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useSettings from '../../hooks/useSettings'; // Pastikan path sesuai struktur folder Anda

export default function CashierSettings() {
  const { settings, update } = useSettings();

  // Helper untuk toggle checkbox yang lebih rapi
  const ToggleSwitch = ({ label, description, icon: Icon, section, field }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30 group">
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <p className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-tight">
            {label}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer"
          checked={settings.cashier[field]}
          onChange={(e) => update(section, field, e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
      </label>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <FiShoppingCart size={20} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
          Sistem <span className="text-emerald-500">Kasir</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Konfirmasi Kosongkan Keranjang */}
        <ToggleSwitch 
          label="Konfirmasi Keranjang"
          description="Munculkan peringatan sebelum menghapus seluruh isi item di keranjang."
          icon={FiAlertCircle}
          section="cashier"
          field="confirmClearCart"
        />

        {/* Shortcut Keyboard */}
        <ToggleSwitch 
          label="Shortcut Cepat"
          description="Aktifkan tombol F1-F12 untuk fungsi pembayaran dan pencarian barang."
          icon={FiZap}
          section="cashier"
          field="enableShortcuts"
        />

        {/* Auto Print Struk */}
        <ToggleSwitch 
          label="Auto-Print Struk"
          description="Otomatis mencetak struk belanja setelah transaksi berhasil divalidasi."
          icon={FiPrinter}
          section="cashier"
          field="autoPrint"
        />
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
        <div className="flex gap-3">
          <FiAlertCircle className="text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium italic">
            Pengaturan ini akan diterapkan secara real-time pada halaman transaksi. Pastikan printer sudah terhubung jika mengaktifkan fitur Auto-Print.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { FiFileText, FiType, FiScissors, FiMessageSquare, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useSettings from '../../hooks/useSettings';

export default function ReceiptSettings() {
  const { settings, update } = useSettings();

  // Komponen Input Field Khusus Struk
  const ReceiptInput = ({ label, icon: Icon, value, onChange, placeholder, isTextArea = false }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-4 ${isTextArea ? 'top-5' : 'top-1/2 -translate-y-1/2'} text-slate-400 group-focus-within:text-emerald-500 transition-colors`}>
          <Icon size={18} />
        </div>
        {isTextArea ? (
          <textarea
            value={value}
            onChange={onChange}
            rows="3"
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-800 dark:text-white resize-none text-sm"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-800 dark:text-white text-sm"
          />
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <FiFileText size={20} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
          Format <span className="text-emerald-500">Struk</span> Belanja
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* KOLOM KIRI: EDITOR */}
        <div className="space-y-6">
          <ReceiptInput 
            label="Header Struk (Nama Toko/Slogan)"
            icon={FiType}
            value={settings.receipt.headerText || ""}
            onChange={(e) => update("receipt", "headerText", e.target.value)}
            placeholder="Contoh: TERIMA KASIH TELAH BELANJA"
          />

          <ReceiptInput 
            label="Catatan Kaki (Footer)"
            icon={FiMessageSquare}
            value={settings.receipt.footerNote}
            onChange={(e) => update("receipt", "footerNote", e.target.value)}
            placeholder="Contoh: Barang yang sudah dibeli tidak dapat ditukar"
            isTextArea={true}
          />

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex gap-3 items-center">
              <FiScissors size={18} className="text-slate-400" />
              <div>
                <p className="text-[11px] font-black uppercase text-slate-800 dark:text-white">Potong Kertas Otomatis</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Gunakan perintah Auto-Cut setelah cetak</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.receipt.autoCut || false}
                onChange={(e) => update("receipt", "autoCut", e.target.checked)}
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* KOLOM KANAN: LIVE PREVIEW */}
        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Tampilan Struk
          </p>
          
          {/* Kertas Struk Simulation */}
          <div className="bg-white dark:bg-slate-100 text-slate-800 p-8 shadow-2xl rounded-sm max-w-[300px] mx-auto min-h-[400px] font-mono text-[11px] relative border-t-8 border-emerald-500">
            <div className="text-center space-y-1 mb-6">
              <p className="font-black text-sm uppercase">{settings.general.warungName || "NAMA TOKO"}</p>
              <p className="text-[9px] leading-tight">{settings.general.address || "Alamat belum diatur"}</p>
              <p className="text-[9px]">{settings.general.phone || "08xx-xxxx"}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 py-2 mb-2 text-center text-[10px] italic">
              {settings.receipt.headerText || "--- RECEIPT ---"}
            </div>

            {/* Mock Items Table */}
            <div className="space-y-1">
              <div className="flex justify-between uppercase">
                <span>Contoh Barang A</span>
                <span>15.000</span>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>1 x 15.000</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300 mt-4 pt-4 space-y-1">
              <div className="flex justify-between font-black uppercase">
                <span>Total</span>
                <span>15.000</span>
              </div>
              <div className="flex justify-between">
                <span>Bayar (Cash)</span>
                <span>20.000</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>5.000</span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-2">
              <p className="whitespace-pre-wrap leading-relaxed italic opacity-70">
                {settings.receipt.footerNote || "Terima kasih atas kunjungan Anda"}
              </p>
              <div className="pt-4 opacity-30 text-[8px] uppercase tracking-widest">
                {new Date().toLocaleDateString('id-ID')} - Warung Digital
              </div>
            </div>
            
            {/* Dekorasi Gigi Potongan Kertas */}
            <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10 rotate-180"></div>
          </div>
        </div>

      </div>

      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 flex gap-3">
        <FiInfo className="text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-bold uppercase tracking-tight">
          Gunakan teks singkat dan jelas pada header & footer. Pastikan lebar kertas printer thermal Anda (58mm atau 80mm) sesuai dengan panjang karakter di atas.
        </p>
      </div>
    </motion.div>
  );
}
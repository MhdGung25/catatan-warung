import React from 'react';
import { FiHome, FiMapPin, FiPhone, FiImage, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useSettings from '../../hooks/useSettings'; // Sesuaikan path folder Anda

export default function GeneralSettings({ setIsCropping }) {
  const { settings, update } = useSettings();

  // Helper untuk Input Field Modern
  const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-800 dark:text-white"
        />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* Header Halaman */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
          <FiHome size={20} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800 dark:text-white">
          Profil <span className="text-emerald-500">Toko</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Kolom Kiri: Form Identitas */}
        <div className="space-y-5">
          <InputGroup 
            label="Nama Warung / Toko"
            icon={FiHome}
            value={settings.general.warungName}
            onChange={(e) => update("general", "warungName", e.target.value)}
            placeholder="Contoh: Warung Digital Sejahtera"
          />

          <InputGroup 
            label="Nomor WhatsApp"
            icon={FiPhone}
            value={settings.general.phone}
            onChange={(e) => update("general", "phone", e.target.value)}
            placeholder="0812xxxx"
            type="tel"
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Alamat Lengkap
            </label>
            <div className="relative group">
              <FiMapPin className="absolute left-4 top-5 text-slate-400 group-focus-within:text-emerald-500" size={18} />
              <textarea
                value={settings.general.address}
                onChange={(e) => update("general", "address", e.target.value)}
                rows="3"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-800 dark:text-white resize-none"
                placeholder="Jl. Raya No. 123..."
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Logo */}
        <div className="space-y-5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            Logo Instansi
          </label>
          <div className="relative group cursor-pointer" onClick={() => setIsCropping(true)}>
            <div className="aspect-video w-full rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 overflow-hidden bg-slate-50 dark:bg-slate-800/30 group-hover:border-emerald-500/50 transition-all">
              {settings.general.logo ? (
                <img 
                  src={settings.general.logo} 
                  alt="Logo Toko" 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <>
                  <div className="p-4 rounded-full bg-white dark:bg-slate-800 shadow-sm text-slate-400 group-hover:text-emerald-500 transition-all">
                    <FiImage size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ganti Logo Toko</p>
                </>
              )}
            </div>
            {/* Overlay Hover */}
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-[2rem] transition-all flex items-center justify-center">
               <span className="opacity-0 group-hover:opacity-100 bg-white text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Ubah Gambar</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex gap-3">
            <FiInfo className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed font-bold uppercase tracking-tight">
              Logo ini akan ditampilkan pada Halaman Login, Dashboard, dan cetak Struk Pembayaran.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
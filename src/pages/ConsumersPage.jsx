import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';

export default function ConsumersPage() {
  // State untuk data (Bisa dihubungkan ke API/Firebase nantinya)
  const [consumers] = useState([
    { id: 'C001', name: 'Budi Santoso', phone: '08123456789', status: 'Aktif', joinDate: '2023-10-12' },
    { id: 'C002', name: 'Siti Aminah', phone: '08567891234', status: 'Aktif', joinDate: '2023-11-05' },
    { id: 'C003', name: 'Agus Setiawan', phone: '08991234567', status: 'Non-Aktif', joinDate: '2023-12-01' },
    { id: 'C004', name: 'Rina Permata', phone: '08122233344', status: 'Aktif', joinDate: '2024-01-10' },
  ]);

  // State untuk Pencarian
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi Filter Otomatis
  const filteredConsumers = useMemo(() => {
    return consumers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, consumers]);

  return (
    <div className="min-h-screen pt-24 md:pt-10 pb-10 px-4 md:px-10 transition-all">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
              Database <span className="text-emerald-500">Konsumen</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Total {filteredConsumers.length} Pelanggan Terdaftar</p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/25 text-sm"
          >
            <FiPlus size={18} /> Tambah Konsumen Baru
          </motion.button>
        </header>

        {/* TABLE CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          
          {/* SEARCH BAR AREA */}
          <div className="p-8 pb-4">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-5 py-3.5 rounded-2xl w-full md:w-96 border border-transparent focus-within:border-emerald-500/50 transition-all">
              <FiSearch className="text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari Nama atau ID Pelanggan..." 
                className="bg-transparent border-none outline-none px-4 py-1 text-sm w-full text-slate-700 dark:text-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto px-8 pb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] uppercase tracking-[0.15em] border-b dark:border-slate-800">
                  <th className="pb-5 font-black">ID Akun</th>
                  <th className="pb-5 font-black">Profil Konsumen</th>
                  <th className="pb-5 font-black">Kontak</th>
                  <th className="pb-5 font-black">Status</th>
                  <th className="pb-5 font-black text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                <AnimatePresence>
                  {filteredConsumers.length > 0 ? filteredConsumers.map((c, i) => (
                    <motion.tr 
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all"
                    >
                      <td className="py-6">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                          {c.id}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white text-sm">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Gabung: {c.joinDate}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{c.phone}</span>
                      </td>
                      <td className="py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          c.status === 'Aktif' 
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-50 transition-all">
                            <FiEdit2 size={14} />
                          </button>
                          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 transition-all">
                            <FiTrash2 size={14} />
                          </button>
                          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 transition-all md:hidden">
                            <FiMoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                          <FiSearch size={48} className="mb-4" />
                          <p className="font-black uppercase tracking-widest text-xs">Konsumen tidak ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER INFO (Menghilangkan nuansa kuning, diganti Emerald Soft) */}
        <div className="mt-8 bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[2rem] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
            <FiPlus size={20} />
          </div>
          <p className="text-[11px] md:text-sm text-emerald-800 dark:text-emerald-300 font-medium">
            <b>Tips:</b> Gunakan fitur pencarian untuk menemukan pelanggan dengan cepat melalui Nama atau ID unik mereka.
          </p>
        </div>
      </div>
    </div>
  );
}
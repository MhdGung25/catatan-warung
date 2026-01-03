import React from 'react';
import { FiEdit3, FiTrash2, FiAlertCircle, FiTag, FiLayers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductTable({ 
  products = [], // Default ke array kosong agar tidak error .map
  onEdit, 
  onDelete, 
  lowStockThreshold = 5,
  selectedItems = [],
  setSelectedItems
}) {
  
  // Fungsi Select All
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(products.map(p => p.code));
    } else {
      setSelectedItems([]);
    }
  };

  // Fungsi Select Per Item
  const toggleSelectItem = (code) => {
    setSelectedItems(prev => 
      prev.includes(code) 
        ? prev.filter(item => item !== code) 
        : [...prev, code]
    );
  };

  return (
    <div className="w-full">
      {/* --- TAMPILAN DESKTOP (TABLE) --- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-800">
              <th className="p-6 text-center w-20">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg accent-emerald-500 cursor-pointer"
                  checked={products.length > 0 && selectedItems.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Barang</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kategori</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Harga Jual</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stok</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            <AnimatePresence mode='popLayout'>
              {products.map((p) => {
                // Pastikan stock & price adalah number untuk pengecekan isLow
                const stockVal = Number(p.stock) || 0;
                const priceVal = Number(p.price) || 0;
                const isLow = stockVal <= lowStockThreshold;
                const isSelected = selectedItems.includes(p.code);

                return (
                  <motion.tr 
                    layout 
                    key={p.code}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${isSelected ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'} transition-colors`}
                  >
                    <td className="p-6 text-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg accent-emerald-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(p.code)}
                      />
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase shadow-sm ${isLow ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                          {p.name ? p.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tighter">{p.name || "Tanpa Nama"}</p>
                          <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">SKU: {p.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                       <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg">
                          {p.category || "Umum"}
                       </span>
                    </td>
                    <td className="p-6 text-center font-black text-slate-700 dark:text-slate-200">
                      Rp {priceVal.toLocaleString('id-ID')}
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${isLow ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'}`}>
                          {stockVal} Unit
                        </span>
                        {isLow && <span className="text-[7px] text-rose-500 font-black uppercase">Restock!</span>}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onEdit(p)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all"><FiEdit3 size={16}/></button>
                        <button onClick={() => onDelete(p.code)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"><FiTrash2 size={16}/></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* --- TAMPILAN MOBILE (GRID CARDS) --- */}
      <div className="md:hidden flex flex-col gap-4 p-4 pb-32">
        <AnimatePresence mode='popLayout'>
          {products.map((p) => {
            const stockVal = Number(p.stock) || 0;
            const priceVal = Number(p.price) || 0;
            const isLow = stockVal <= lowStockThreshold;
            const isSelected = selectedItems.includes(p.code);

            return (
              <motion.div 
                layout
                key={p.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative p-5 rounded-[2.5rem] border transition-all ${
                  isSelected 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Checkbox Floating */}
                <div className="absolute top-6 right-6">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 rounded-full accent-emerald-500 cursor-pointer"
                    checked={isSelected}
                    onChange={() => toggleSelectItem(p.code)}
                  />
                </div>

                {/* Info Utama */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black text-xl text-white shadow-lg ${isLow ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
                    {p.name ? p.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="pr-10">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tight leading-tight mb-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {p.code}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Grid Data */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent dark:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                      <FiTag className="text-emerald-500"/> Harga Jual
                    </p>
                    <p className="text-[13px] font-black dark:text-white text-slate-800">
                      Rp {priceVal.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isLow ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'}`}>
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                      <FiLayers className={isLow ? 'text-rose-500' : 'text-emerald-500'}/> Stok Sisa
                    </p>
                    <p className={`text-[13px] font-black ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {stockVal} <span className="text-[9px]">Unit</span>
                    </p>
                  </div>
                </div>

                {/* Button Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(p)}
                    className="flex-1 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <FiEdit3 size={14}/> Edit Barang
                  </button>
                  <button 
                    onClick={() => onDelete(p.code)}
                    className="w-14 py-4 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    <FiTrash2 size={16}/>
                  </button>
                </div>

                {isLow && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full shadow-lg flex items-center gap-2 border-2 border-white dark:border-slate-900 animate-bounce">
                    <FiAlertCircle size={10}/>
                    <span className="text-[7px] font-black uppercase tracking-tighter">Stok Hampir Habis!</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
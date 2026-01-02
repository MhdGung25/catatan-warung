import React from 'react';
import { FiEdit3, FiTrash2, FiBox, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProductTable({ 
  products, 
  onEdit, 
  onDelete, 
  lowStockThreshold = 5,
  selectedItems = [],
  setSelectedItems
}) {
  
  // Fungsi untuk toggle pilih semua item
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(products.map(p => p.code));
    } else {
      setSelectedItems([]);
    }
  };

  // Fungsi untuk toggle satu item
  const toggleSelectItem = (code) => {
    setSelectedItems(prev => 
      prev.includes(code) 
        ? prev.filter(item => item !== code) 
        : [...prev, code]
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="bg-emerald-50/30 dark:bg-emerald-900/10 border-b dark:border-slate-800">
              <th className="p-5 md:p-6 text-center w-14 md:w-20">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg accent-emerald-500 cursor-pointer border-slate-300 dark:border-slate-700"
                  checked={products.length > 0 && selectedItems.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-5 md:p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Data Inventaris</th>
              <th className="p-5 md:p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Harga Jual</th>
              <th className="p-5 md:p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status Stok</th>
              <th className="p-5 md:p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-16 md:p-24 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-300 dark:text-slate-600">
                    <FiBox size={64} className="opacity-20 text-emerald-500" />
                    <div className="space-y-1">
                      <p className="font-black text-[10px] uppercase tracking-widest">Gudang Kosong</p>
                      <p className="text-[10px] italic">Silahkan tambahkan produk baru</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLow = Number(p.stock) <= lowStockThreshold;
                const isSelected = selectedItems.includes(p.code);

                return (
                  <motion.tr 
                    layout
                    key={p.code} 
                    className={`group transition-all ${
                      isSelected 
                        ? 'bg-emerald-50/50 dark:bg-emerald-500/10' 
                        : 'hover:bg-emerald-50/20 dark:hover:bg-emerald-900/5'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-5 md:p-6 text-center">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded-lg accent-emerald-500 cursor-pointer border-slate-300 dark:border-slate-700"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(p.code)}
                      />
                    </td>

                    {/* Info Produk */}
                    <td className="p-5 md:p-6">
                      <div className="flex items-center gap-4">
                        <div className={`hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center font-black text-sm transition-all shadow-sm border ${
                          isSelected 
                            ? 'bg-emerald-500 text-white border-emerald-400' 
                            : 'bg-white dark:bg-slate-800 text-emerald-500 border-slate-100 dark:border-slate-700 group-hover:border-emerald-500/30'
                        }`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="max-w-[150px] md:max-w-none">
                          <p className="font-black text-slate-800 dark:text-white uppercase text-xs md:text-sm tracking-tight leading-none mb-1.5">
                            {p.name}
                          </p>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase tracking-tighter border dark:border-slate-700">
                            {p.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Harga */}
                    <td className="p-5 md:p-6 text-center">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs md:text-sm">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </span>
                    </td>

                    {/* Stok */}
                    <td className="p-5 md:p-6 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          isLow 
                            ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        }`}>
                          {p.stock} Unit
                        </span>
                        {isLow && (
                          <span className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1 animate-pulse">
                            <FiAlertCircle size={10} /> Restock Segera
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="p-5 md:p-6 text-right">
                      <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => onEdit(p)} 
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all active:scale-90"
                          title="Edit Produk"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(p.code)} 
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10 transition-all active:scale-90"
                          title="Hapus Produk"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React from 'react';
import { FiEdit3, FiTrash2, FiTag, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onEdit, onDelete, lowStockThreshold = 5 }) {
  const isLowStock = Number(product.stock) <= lowStockThreshold;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-[#0f172a] p-5 rounded-[2rem] border dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
    >
      {/* Header Card */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 font-black uppercase text-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            {product.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm leading-tight">
              {product.name}
            </h3>
            <span className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter uppercase">
              SKU: {product.code}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(product)} 
            className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
            title="Edit Barang"
          >
            <FiEdit3 size={18} />
          </button>
          <button 
            onClick={() => onDelete(product.code)} 
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Hapus Barang"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Info Detail */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-transparent dark:border-slate-800/50">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
            <FiTag /> Harga Jual
          </p>
          <p className="font-black text-sm dark:text-white">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </p>
        </div>

        <div className={`p-3 rounded-2xl border ${
          isLowStock 
            ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20' 
            : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
        }`}>
          <p className="text-[8px] font-black text-slate-400 uppercase mb-1 flex items-center gap-1">
            <FiLayers /> Stok
          </p>
          <p className={`font-black text-sm ${isLowStock ? 'text-red-500' : 'text-emerald-500'}`}>
            {product.stock} <span className="text-[10px]">Unit</span>
          </p>
        </div>
      </div>

      {/* Indikator Visual Cepat (Mobile Friendly) */}
      {isLowStock && (
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
            Perlu Re-stok Segera
          </span>
        </div>
      )}
    </motion.div>
  );
}
import React from 'react';
import { FiEdit3, FiTrash2, FiTag, FiLayers, FiAlertCircle } from 'react-icons/fi'; // FiMoreVertical dihapus
import { AnimatePresence, motion } from 'framer-motion';

export default function ProductCard({ product, onEdit, onDelete, lowStockThreshold = 5 }) {
  const stockCount = Number(product.stock) || 0;
  const isLowStock = stockCount <= lowStockThreshold;
  const isOutOfStock = stockCount === 0;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white dark:bg-[#0f172a] p-4 rounded-[2rem] border ${
        isLowStock 
          ? 'border-red-100 dark:border-red-900/30' 
          : 'border-slate-100 dark:border-slate-800'
      } shadow-sm transition-all group overflow-hidden`}
    >
      {/* 1. STATUS BADGE */}
      <AnimatePresence>
        {isLowStock && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 left-3 z-10"
          >
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${
              isOutOfStock ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'
            }`}>
              {isOutOfStock ? 'Habis' : 'Limit'} <FiAlertCircle size={8} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER & MAIN CONTENT */}
      <div className="flex flex-col items-center text-center mt-2 mb-4">
        {/* Icon Produk */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl mb-3 transition-all duration-500 ${
          isOutOfStock 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' 
            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
        }`}>
          {product.name.charAt(0).toUpperCase()}
        </div>

        <div className="w-full px-2">
          <h3 className="font-black text-slate-800 dark:text-white uppercase text-[13px] leading-tight truncate">
            {product.name}
          </h3>
          <p className="text-[9px] font-mono font-medium text-slate-400 tracking-tighter uppercase mt-1">
            #{product.code}
          </p>
        </div>
      </div>

      {/* 3. INFO GRID (Harga & Stok) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 flex items-center justify-center gap-1">
            <FiTag size={10} className="text-emerald-500" /> Harga
          </p>
          <p className="font-black text-[11px] text-slate-800 dark:text-white text-center">
            {Number(product.price || 0).toLocaleString('id-ID')}
          </p>
        </div>

        <div className={`p-2.5 rounded-xl border transition-all ${
          isLowStock 
            ? 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20' 
            : 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20'
        }`}>
          <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 flex items-center justify-center gap-1">
            <FiLayers size={10} className={isLowStock ? 'text-red-500' : 'text-emerald-500'} /> Stok
          </p>
          <p className={`font-black text-[11px] text-center ${isLowStock ? 'text-red-600' : 'text-emerald-600'}`}>
            {product.stock} <span className="text-[8px] font-medium opacity-60">Unit</span>
          </p>
        </div>
      </div>

      {/* 4. ACTIONS FOOTER */}
      <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(product); }} 
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
        >
          <FiEdit3 size={14} /> EDIT
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(product.code); }} 
          className="w-12 flex items-center justify-center py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* 5. RE-STOCK ANIMATION LINE */}
      {isLowStock && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/10">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-red-500 origin-left"
          />
        </div>
      )}
    </motion.div>
  );
}
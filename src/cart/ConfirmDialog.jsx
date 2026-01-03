import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

export default function ConfirmDialog({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        /* items-start di HP agar dialog muncul di atas, items-center di Desktop */
        <div className="fixed inset-0 z-[2000] flex items-start md:items-center justify-center p-6 overflow-y-auto">
          
          {/* Backdrop dengan Blur Tinggi */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            /* Animasi: Muncul dari atas ke bawah untuk Mobile */
            initial={{ scale: 0.9, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -40 }}
            className="relative bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 dark:border-slate-800 mt-10 md:mt-0"
          >
            {/* Header dengan Icon Warning */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
                <FiAlertTriangle size={36} className="animate-pulse" />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">
                Kosongkan <span className="text-red-500">Keranjang?</span>
              </h3>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed px-4">
                Tindakan ini akan menghapus semua item yang sudah dipilih secara permanen.
              </p>
            </div>

            {/* Action Buttons - Layout Stacked untuk Jari HP */}
            <div className="p-8 pt-0 flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-[1.5rem] shadow-lg shadow-red-500/30 uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
              >
                <FiTrash2 size={16} /> Ya, Hapus Semua
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-black rounded-[1.5rem] uppercase text-[10px] tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Batalkan
              </motion.button>
            </div>

            {/* Tombol Close di Pojok */}
            <button 
              onClick={onCancel}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-red-500 transition-colors"
            >
              <FiX size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

export default function ConfirmDialog({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          {/* Overlay / Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border dark:border-slate-800"
          >
            {/* Header dengan Icon Warning */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
                <FiAlertTriangle size={40} />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
                Kosongkan Keranjang?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed px-4">
                Tindakan ini akan menghapus **semua item** yang sudah Anda pilih. Data tidak dapat dikembalikan.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-8 pt-0 flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/30 uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <FiTrash2 size={16} /> Ya, Hapus Semua
              </button>
              
              <button
                onClick={onCancel}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
              >
                Batalkan
              </button>
            </div>

            {/* Tombol Close di Pojok */}
            <button 
              onClick={onCancel}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 dark:hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
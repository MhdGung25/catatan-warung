import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onCancel} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
            className="relative bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center"
          >
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
              <FiAlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-2">Kosongkan Keranjang?</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Semua item akan dihapus dari daftar.</p>
            <div className="flex flex-col gap-3">
              <button onClick={onConfirm} className="w-full py-4 bg-rose-500 text-white font-black rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20">Ya, Hapus Semua</button>
              <button onClick={onCancel} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-black rounded-xl uppercase text-[10px] tracking-widest">Batalkan</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
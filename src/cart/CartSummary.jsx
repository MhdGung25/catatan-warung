import React from "react";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CartSummary({ totalQty, totalPrice, onCheckout }) {
  return (
    /* Di HP: Floating di atas dengan margin. Di Desktop: Statis. */
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-4 z-[50] mx-auto w-full max-w-7xl px-2 md:px-0 md:relative md:top-0"
    >
      <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl shadow-emerald-500/10 flex items-center justify-between overflow-hidden">
        
        {/* Dekorasi Cahaya di Pojok (HP Only) */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/10 blur-[50px] pointer-events-none md:hidden" />

        {/* Sisi Kiri: Status Keranjang */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FiShoppingCart size={20} />
            </div>
            {totalQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a]">
                {totalQty}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Ringkasan Pesanan
            </p>
            <p className="font-black text-slate-800 dark:text-white text-xs md:text-sm">
              {totalQty} <span className="opacity-50">Unit Terpilih</span>
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Harga & Aksi Cepat */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">
              Total Bayar
            </p>
            <p className="font-black text-sm md:text-xl text-slate-800 dark:text-white">
              <span className="text-[10px] mr-0.5 text-slate-400">Rp</span>
              {totalPrice.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Tombol Panah sebagai Trigger Checkout Cepat di HP */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCheckout}
            className="w-10 h-10 bg-slate-900 dark:bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
          >
            <FiArrowRight size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CartSummary({ totalQty, totalPrice }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0f172a] p-4 md:p-6 rounded-[2rem] border dark:border-slate-800 shadow-sm flex items-center justify-between"
    >
      {/* Sisi Kiri: Icon & Jumlah */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
            <FiShoppingCart size={24} />
          </div>
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0f172a] animate-bounce">
              {totalQty}
            </span>
          )}
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Total Item</p>
          <p className="font-black text-slate-800 dark:text-white text-sm md:text-base">
            {totalQty} Barang
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Total Harga */}
      <div className="text-right">
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">Estimasi Total</p>
        <p className="font-black text-xl md:text-2xl text-slate-800 dark:text-white">
          <span className="text-xs mr-1 text-slate-400">Rp</span>
          {totalPrice.toLocaleString("id-ID")}
        </p>
      </div>
    </motion.div>
  );
}
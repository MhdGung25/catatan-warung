import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav({ menuItems }) {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-4 z-[200] pb-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            className="relative flex-1 h-full flex flex-col items-center justify-center"
          >
            {/* Background Soft saat Active */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="mobileActive"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-x-1 inset-y-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            {/* Ikon dan Label */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <motion.span
                animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
                className={`text-2xl transition-colors duration-300 ${
                  isActive 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {item.icon}
              </motion.span>

              {/* Label Teks Kecil sesuai Desain Baru */}
              <span
                className={`text-[10px] font-bold tracking-tight transition-colors duration-300 ${
                  isActive 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </div>

            {/* Garis Indikator Atas (Opsional agar terlihat premium) */}
            {isActive && (
              <motion.div
                layoutId="topLine"
                className="absolute top-0 h-1 w-8 bg-emerald-500 rounded-b-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
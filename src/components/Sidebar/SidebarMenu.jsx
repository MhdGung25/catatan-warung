import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarMenu({ menuItems }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-1 w-full flex-1">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.id}
            to={item.path}
            className="relative group flex items-center px-4 py-3 rounded-xl transition-all duration-200 outline-none"
          >
            {/* Background Lembut saat Aktif (Mirip Gambar) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="activeHighlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {/* Ikon */}
            <motion.span
              animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              className={`relative z-10 text-xl transition-colors duration-300 ${
                isActive 
                  ? "text-emerald-600" 
                  : "text-slate-400 group-hover:text-emerald-500"
              }`}
            >
              {item.icon}
            </motion.span>

            {/* Label Teks di Samping Ikon */}
            <span
              className={`relative z-10 ml-4 text-sm transition-colors duration-300 ${
                isActive 
                  ? "text-emerald-600 font-bold" 
                  : "text-slate-500 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-200"
              }`}
            >
              {item.label}
            </span>

            {/* Indikator Garis Samping (Opsional - Sangat Clean) */}
            {isActive && (
              <motion.div
                layoutId="activeBar"
                className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
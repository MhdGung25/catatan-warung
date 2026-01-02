import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileBottomNav({ menuItems }) {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-6 inset-x-6 h-20 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-lg rounded-[2.5rem] flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[200] border border-white/20 dark:border-slate-800">
      {menuItems.map((item) => {
        // Cek active secara presisi
        const isActive = location.pathname === item.path;

        return (
          <NavLink 
            key={item.id} 
            to={item.path} 
            className="relative flex-1 h-full flex flex-col items-center justify-center transition-colors duration-300"
          >
            {/* Indikator Latar Belakang Lingkaran (Hanya muncul jika aktif) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-x-2 inset-y-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-[1.5rem]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            {/* Ikon dan Label */}
            <motion.div 
              className="relative z-10 flex flex-col items-center"
              animate={isActive ? { y: -2 } : { y: 0 }}
            >
              <motion.span 
                className={`text-2xl ${isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
              >
                {item.icon}
              </motion.span>

              {/* Label Teks (Muncul hanya saat aktif atau bisa dibuat permanen) */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-tighter text-emerald-600 dark:text-emerald-400 mt-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Dot Indikator di bawah */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-3 h-1.5 w-1.5 bg-emerald-500 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
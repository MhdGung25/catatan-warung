import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SidebarMenu({ menuItems }) {
  const location = useLocation();

  return (
    <nav className="flex flex-col gap-5 w-full px-4 flex-1 mt-6">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <div key={item.id} className="group relative">
            <NavLink
              to={item.path}
              className={`relative z-10 flex flex-col items-center justify-center py-5 rounded-[2rem] transition-all duration-300 overflow-hidden ${
                isActive
                  ? "text-white shadow-xl shadow-emerald-500/20"
                  : "text-slate-400 hover:text-emerald-500 dark:text-slate-500 dark:hover:bg-slate-800/50 hover:bg-slate-50"
              }`}
            >
              {/* Latar Belakang Aktif dengan Framer Motion */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBg"
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Ikon dengan Animasi Scale */}
              <motion.span 
                animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                className="text-2xl mb-1 relative z-20"
              >
                {item.icon}
              </motion.span>

              {/* Label */}
              <span className={`text-[9px] font-black uppercase tracking-[0.15em] relative z-20 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {item.label}
              </span>
            </NavLink>

            {/* Tooltip Modern */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-slate-900 dark:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 scale-90 translate-x-[-10px] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-[200] shadow-xl">
              {item.label}
              {/* Arrow Tooltip */}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-emerald-500 rotate-45" />
            </div>
          </div>
        );
      })}
    </nav>
  );
}
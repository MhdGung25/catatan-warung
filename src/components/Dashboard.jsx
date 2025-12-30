import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, FiBox, FiDollarSign, FiShoppingBag, 
  FiCalendar, FiClock, FiZap, FiPackage, FiActivity
} from "react-icons/fi";
import { motion } from "framer-motion";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    recentSales: []
  });

  useEffect(() => {
    // Sync data dari LocalStorage
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");

    const revenue = savedSales.reduce((sum, sale) => sum + sale.total, 0);
    const lowStock = savedProducts.filter(p => Number(p.stock) <= 5).length;

    setStats({
      totalRevenue: revenue,
      totalOrders: savedSales.length,
      totalProducts: savedProducts.length,
      lowStockItems: lowStock,
      recentSales: savedSales.slice(0, 5) 
    });
  }, []);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="pt-20 md:pt-28 min-h-screen bg-slate-50 dark:bg-[#020617] font-sans pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* HEADER SECTION - Responsive Grid */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-2xl md:text-3xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <FiActivity className="text-emerald-500" size={32} /> Ringkasan Bisnis
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Pantau perkembangan tokomu secara real-time</p>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
              <FiCalendar size={20}/>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hari Ini</span>
              <span className="text-xs font-black dark:text-white uppercase">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* STATS CARDS - 2 Columns on Mobile, 4 on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: "Omzet", val: formatIDR(stats.totalRevenue), icon: <FiDollarSign />, color: "bg-blue-500" },
            { label: "Transaksi", val: stats.totalOrders, icon: <FiShoppingBag />, color: "bg-emerald-500" },
            { label: "Produk", val: stats.totalProducts, icon: <FiBox />, color: "bg-indigo-500" },
            { label: "Low Stock", val: stats.lowStockItems, icon: <FiPackage />, color: "bg-red-500", crit: stats.lowStockItems > 0 },
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition-all group"
            >
              <div className={`${item.color} w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-${item.color.split('-')[1]}-500/20`}>
                {item.icon}
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h2 className={`text-sm md:text-xl font-black dark:text-white truncate ${item.crit ? 'text-red-500' : ''}`}>{item.val}</h2>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* RECENT SALES - Full width on mobile */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            <div className="p-6 md:p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-black dark:text-white uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <FiClock className="text-blue-500" /> Histori Terakhir
              </h3>
            </div>
            
            <div className="overflow-x-auto px-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800">
                    <th className="px-6 py-5">Info</th>
                    <th className="px-6 py-5">Metode</th>
                    <th className="px-6 py-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-800 dark:text-white text-xs uppercase">{sale.id}</p>
                        <p className="text-[9px] text-slate-400">{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-black px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 dark:text-slate-400 uppercase">
                          {sale.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-xs md:text-sm">
                        {formatIDR(sale.total)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-20 text-center text-slate-400 italic text-[10px] uppercase font-bold tracking-widest">Belum ada aktivitas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - SIDEBAR DASHBOARD */}
          <div className="lg:col-span-4 space-y-6">
            {/* Promo Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-500/20"
            >
              <FiTrendingUp className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 rotate-12" />
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Kinerja Bagus!</h4>
                <p className="text-emerald-100 text-[11px] font-medium mb-8 leading-relaxed">Tokomu berjalan stabil. Terus tingkatkan stok produk yang paling laku.</p>
                <div className="flex items-center gap-2 bg-emerald-700/50 w-fit px-4 py-2 rounded-xl backdrop-blur-sm">
                  <FiZap className="text-yellow-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Premium Active</span>
                </div>
              </div>
            </motion.div>

            {/* Health Bar Stock */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-black dark:text-white uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                <FiPackage className="text-amber-500" /> Status Inventaris
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Ketersediaan Barang</span>
                    <span className="text-[10px] font-black text-emerald-500">85%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1 }}
                      className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed dark:border-slate-700">
                  <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed text-center">
                    {stats.lowStockItems > 0 
                      ? `Perhatian: Ada ${stats.lowStockItems} produk yang hampir habis!` 
                      : "Semua stok produk terpantau aman hari ini."}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
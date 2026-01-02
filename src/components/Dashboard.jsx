import React, { useState, useEffect, useCallback } from "react";
import { 
  FiTrendingUp, FiDollarSign, FiShoppingBag, 
  FiClock, FiActivity, FiAlertCircle, FiPieChart,
  FiBox, FiCheckCircle, FiZap
} from "react-icons/fi";
import { motion } from "framer-motion";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: [],
    healthPercent: 0,
    recentSales: [],
    topProducts: [],
    isShopOpen: true,
    lastUpdate: ""
  });

  const refreshData = useCallback(() => {
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    const threshold = Number(localStorage.getItem("low_stock_threshold") || 5);
    const shopHours = localStorage.getItem("warung_open") || "08:00 - 21:00";

    let revenue = 0;
    let profit = 0;

    const today = new Date().toDateString();
    const todaySales = savedSales.filter(sale => new Date(sale.date).toDateString() === today);

    savedSales.forEach(sale => {
      revenue += Number(sale.total) || 0;
      if (sale.items) {
        sale.items.forEach(item => {
          const prod = savedProducts.find(p => p.name === item.name);
          const cost = prod ? Number(prod.costPrice || 0) : 0;
          profit += (Number(item.price) - cost) * Number(item.qty);
        });
      }
    });

    const productCounts = {};
    savedSales.forEach(sale => {
      sale.items?.forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + Number(item.qty);
      });
    });

    const topProducts = Object.entries(productCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const lowStockDetails = savedProducts.filter(p => Number(p.stock) <= threshold);
    const healthPercentage = savedProducts.length > 0 
      ? Math.round(((savedProducts.length - lowStockDetails.length) / savedProducts.length) * 100) 
      : 100;

    const checkStatus = () => {
      try {
        const now = new Date();
        const current = now.getHours() * 60 + now.getMinutes();
        const [start, end] = shopHours.split("-").map(t => t.trim());
        const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
        return current >= toMin(start) && current <= toMin(end);
      } catch (e) { return true; }
    };

    setStats({
      totalRevenue: revenue,
      totalProfit: profit,
      totalOrders: todaySales.length,
      totalProducts: savedProducts.length,
      lowStockItems: lowStockDetails,
      healthPercent: healthPercentage,
      recentSales: savedSales.slice(-6).reverse(),
      topProducts: topProducts,
      isShopOpen: checkStatus(),
      lastUpdate: new Date().toLocaleTimeString('id-ID')
    });
  }, []);

  useEffect(() => {
    refreshData();
    window.addEventListener('storage', refreshData);
    const interval = setInterval(refreshData, 30000);
    return () => {
      window.removeEventListener('storage', refreshData);
      clearInterval(interval);
    };
  }, [refreshData]);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter">
                Control <span className="text-emerald-500">Center</span>
              </h1>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 flex items-center gap-2 ${stats.isShopOpen ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                <span className={`w-2 h-2 rounded-full ${stats.isShopOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                {stats.isShopOpen ? 'SISTEM AKTIF' : 'SISTEM OFFLINE'}
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <FiZap className="text-emerald-500" /> Sinkronisasi: {stats.lastUpdate} WIB
            </p>
          </motion.div>
        </div>

        {/* QUICK STATS - THEMED GREEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Omzet Kumulatif", val: formatIDR(stats.totalRevenue), icon: <FiDollarSign />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Estimasi Laba", val: formatIDR(stats.totalProfit), icon: <FiTrendingUp />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Transaksi Hari Ini", val: `${stats.totalOrders} Trx`, icon: <FiShoppingBag />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Kesehatan Stok", val: `${stats.healthPercent}%`, icon: <FiActivity />, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                {React.cloneElement(card.icon, { size: 20 })}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className="text-2xl font-black dark:text-white tracking-tight">{card.val}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: MONITOR TRANSAKSI (GREEN ACCENT) */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10">
                <div className="flex items-center gap-3">
                  <FiClock className="text-emerald-500" />
                  <h3 className="font-black dark:text-white uppercase text-xs tracking-widest">Live Feed Penjualan</h3>
                </div>
                <span className="text-[9px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-tighter">Live Monitor</span>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                    <motion.div key={sale.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                          <FiCheckCircle className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-black dark:text-white text-xs uppercase">{sale.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(sale.date).toLocaleTimeString('id-ID')} • {sale.method}</p>
                        </div>
                      </div>
                      <p className="font-black text-emerald-600 dark:text-emerald-400">{formatIDR(sale.total)}</p>
                    </motion.div>
                  )) : (
                    <div className="py-20 text-center opacity-30 italic font-black uppercase text-xs tracking-widest dark:text-white">Belum ada aktivitas hari ini</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: URGENSI & TREN (GREEN THEMED) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* INVENTORI KRITIS */}
            <div className="bg-emerald-600 rounded-[3rem] p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2 text-emerald-100">
                  <FiAlertCircle /> Perhatian Stok
                </h3>
                <div className="space-y-4">
                  {stats.lowStockItems.length > 0 ? stats.lowStockItems.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <FiBox className="text-emerald-200" />
                        <span className="font-black uppercase text-[11px] truncate max-w-[150px]">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-black bg-white text-emerald-600 px-3 py-1 rounded-full">
                        Sisa {item.stock}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-4 bg-white/10 rounded-2xl border border-white/5">
                       <p className="text-[10px] font-black uppercase tracking-widest">Gudang Aman ✅</p>
                    </div>
                  )}
                </div>
              </div>
              <FiBox className="absolute -bottom-10 -right-10 text-white/10 w-40 h-40" />
            </div>

            {/* TOP PRODUCTS (THEMED GREEN) */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-black dark:text-white uppercase text-[10px] tracking-widest mb-8 flex items-center gap-3">
                <FiPieChart className="text-emerald-500" /> Paling Laris
              </h3>
              <div className="space-y-5">
                {stats.topProducts.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="dark:text-slate-400">{item.name}</span>
                      <span className="font-black text-emerald-500">{item.qty} Pcs</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${stats.topProducts[0] ? (item.qty / stats.topProducts[0].qty) * 100 : 0}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
import React, { useState, useEffect } from "react";
// 1. Pastikan useNavigate diimpor
import { useNavigate } from "react-router-dom"; 
import { 
  FiTrendingUp, FiBox, FiDollarSign, FiShoppingBag, 
  FiCalendar, FiClock, FiZap, FiPackage, FiActivity, FiAlertCircle
} from "react-icons/fi";
import { motion } from "framer-motion";

function DashboardPage() {
  // 2. INISIALISASI NAVIGATE (Ini solusi untuk menghilangkan garis merah)
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    healthPercent: 0,
    recentSales: [],
    statusMessage: "",
    isShopOpen: true
  });

  useEffect(() => {
    // Ambil data dari LocalStorage
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    
    // Integrasi dengan Settings (Threshold stok dan Jam Buka)
    const threshold = Number(localStorage.getItem("low_stock_threshold") || 5);
    const shopHours = localStorage.getItem("warung_open") || "08:00 - 21:00";

    // Hitung Omzet
    const revenue = savedSales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Hitung Stok Rendah berdasarkan Threshold dari Settings
    const lowStockList = savedProducts.filter(p => Number(p.stock) <= threshold);
    const lowStockCount = lowStockList.length;

    // Hitung Kesehatan Inventaris
    let percentage = 0;
    if (savedProducts.length > 0) {
      const safeItems = savedProducts.length - lowStockCount;
      percentage = Math.round((safeItems / savedProducts.length) * 100);
    }

    // Logika Cek Toko Buka/Tutup Otomatis
    const checkStatus = () => {
      try {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [start, end] = shopHours.split("-").map(t => t.trim());
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;
        return currentTime >= startTime && currentTime <= endTime;
      } catch (e) { return true; }
    };

    // Pesan Status Dinamis
    let msg = "";
    if (lowStockCount > 0) {
      msg = `Peringatan: ${lowStockCount} produk di bawah batas aman (${threshold} pcs).`;
    } else if (savedProducts.length === 0) {
      msg = "Inventaris kosong. Mulai tambahkan produk sekarang.";
    } else {
      msg = "Manajemen stok luar biasa! Semua produk terpantau aman.";
    }

    setStats({
      totalRevenue: revenue,
      totalOrders: savedSales.length,
      totalProducts: savedProducts.length,
      lowStockItems: lowStockCount,
      healthPercent: percentage,
      recentSales: savedSales.slice(-5).reverse(),
      statusMessage: msg,
      isShopOpen: checkStatus()
    });
  }, []);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val);

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-slate-50 dark:bg-[#020617] pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-4xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
                <FiActivity className="text-emerald-500" size={32} /> Dashboard
              </h1>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                stats.isShopOpen 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {stats.isShopOpen ? '● Terbuka' : '○ Tutup'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
              Analisis Aktivitas Bisnis Real-Time
            </p>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 pr-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
              <FiCalendar size={20}/>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Data</span>
              <span className="text-xs font-black dark:text-white uppercase">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: "Total Omzet", val: formatIDR(stats.totalRevenue), icon: <FiDollarSign />, color: "bg-blue-600", shadow: "shadow-blue-500/20" },
            { label: "Total Pesanan", val: `${stats.totalOrders} Transaksi`, icon: <FiShoppingBag />, color: "bg-emerald-600", shadow: "shadow-emerald-500/20" },
            { label: "Aset Produk", val: `${stats.totalProducts} Item`, icon: <FiBox />, color: "bg-indigo-600", shadow: "shadow-indigo-500/20" },
            { label: "Stok Kritis", val: `${stats.lowStockItems} Produk`, icon: <FiAlertCircle />, color: "bg-rose-600", shadow: "shadow-rose-500/20", crit: stats.lowStockItems > 0 },
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={i} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all"
            >
              <div className={`${item.color} w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg ${item.shadow}`}>
                {item.icon}
              </div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.label}</p>
              <h2 className={`text-sm md:text-xl font-black dark:text-white truncate ${item.crit ? 'text-rose-500 animate-pulse' : ''}`}>{item.val}</h2>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* RECENT SALES TABLE */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-black dark:text-white uppercase text-xs tracking-widest flex items-center gap-3">
                <FiClock className="text-blue-500" /> Transaksi Terakhir
              </h3>
              {/* TOMBOL YANG TADI EROR - Sekarang Sudah Aman */}
              <button 
                onClick={() => navigate("/laporan")} 
                className="text-[9px] font-black uppercase text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
              >
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800">
                    <th className="px-8 py-5">Detail Transaksi</th>
                    <th className="px-8 py-5">Metode</th>
                    <th className="px-8 py-5 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                    <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-tight group-hover:text-emerald-500 transition-colors">{sale.id}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                          {new Date(sale.date).toLocaleString('id-ID', {hour: '2-digit', minute:'2-digit'})} WIB
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 dark:text-slate-300 uppercase border dark:border-slate-700">
                          {sale.method}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatIDR(sale.total)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="py-24 text-center">
                         <FiShoppingBag className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
                         <p className="text-slate-400 italic text-[10px] uppercase font-black tracking-widest">Belum ada aktivitas penjualan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className={`${stats.lowStockItems > 0 ? 'bg-rose-600 shadow-rose-500/20' : 'bg-emerald-600 shadow-emerald-500/20'} rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl transition-colors duration-500`}
            >
              <FiTrendingUp className="absolute -right-6 -bottom-6 text-white/10 w-40 h-40 rotate-12" />
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 uppercase tracking-tight leading-tight">
                   {stats.lowStockItems > 0 ? 'Waspada Stok!' : 'Kinerja Stabil'}
                </h4>
                <p className="text-white/80 text-[10px] font-bold mb-8 leading-relaxed uppercase tracking-wide">
                  {stats.statusMessage}
                </p>
                <div className="flex items-center gap-2 bg-black/20 w-fit px-4 py-2 rounded-2xl backdrop-blur-md border border-white/10">
                  <FiZap className="text-yellow-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Auto-Sync Active</span>
                </div>
              </div>
            </motion.div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black dark:text-white uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                  <FiPackage className="text-amber-500" /> Kesehatan Stok
                </h3>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stats.healthPercent < 50 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {stats.healthPercent}%
                </span>
              </div>
              <div className="space-y-6">
                <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${stats.healthPercent}%` }} 
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full shadow-lg ${stats.healthPercent < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  />
                </div>
                <div className={`p-5 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${stats.lowStockItems > 0 ? 'bg-rose-50/50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-900/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'}`}>
                  <p className={`text-[9px] font-black uppercase leading-relaxed text-center ${stats.lowStockItems > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    Sistem memantau {stats.totalProducts} aset produk Anda secara otomatis.
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
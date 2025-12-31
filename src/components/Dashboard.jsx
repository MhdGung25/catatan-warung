import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, FiDollarSign, FiShoppingBag, 
  FiClock, FiActivity, FiAlertCircle, FiPieChart 
} from "react-icons/fi";
import { motion } from "framer-motion";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    healthPercent: 0,
    recentSales: [],
    topProducts: [],
    statusMessage: "",
    isShopOpen: true
  });

  // Fungsi utama untuk kalkulasi data
  const refreshData = () => {
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    const threshold = Number(localStorage.getItem("low_stock_threshold") || 5);
    const shopHours = localStorage.getItem("warung_open") || "08:00 - 21:00";

    let revenue = 0;
    let profit = 0;

    // 1. Kalkulasi Keuangan dengan Validasi Angka (Cegah NaN)
    savedSales.forEach(sale => {
      const saleTotal = Number(sale.total) || 0;
      revenue += saleTotal;

      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const originalProduct = savedProducts.find(p => p.name === item.name);
          
          // Ambil harga beli (costPrice) dan harga jual (price)
          // Jika costPrice tidak ada, asumsikan profit 0 untuk item tersebut
          const costPrice = originalProduct ? Number(originalProduct.costPrice || 0) : 0;
          const sellingPrice = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;

          // Rumus: (Harga Jual - Harga Beli) * Jumlah
          if (costPrice > 0) {
            profit += (sellingPrice - costPrice) * qty;
          } else {
            // Jika tidak ada data harga modal, laba dianggap 0 agar tidak merusak total
            profit += 0;
          }
        });
      }
    });
    
    // 2. Analisis Produk Terlaris
    const productCounts = {};
    savedSales.forEach(sale => {
      if (sale.items) {
        sale.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + (Number(item.qty) || 0);
        });
      }
    });

    const topProducts = Object.entries(productCounts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // 3. Status Stok
    const lowStockCount = savedProducts.filter(p => Number(p.stock) <= threshold).length;
    let healthPercentage = 100;
    if (savedProducts.length > 0) {
      healthPercentage = Math.round(((savedProducts.length - lowStockCount) / savedProducts.length) * 100);
    }

    // 4. Cek Jam Operasional
    const checkStatus = () => {
      try {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [start, end] = shopHours.split("-").map(t => t.trim());
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        return currentTime >= (startH * 60 + startM) && currentTime <= (endH * 60 + endM);
      } catch (e) { return true; }
    };

    setStats({
      totalRevenue: revenue,
      totalProfit: profit,
      totalOrders: savedSales.length,
      totalProducts: savedProducts.length,
      lowStockItems: lowStockCount,
      healthPercent: healthPercentage,
      recentSales: savedSales.slice(-8).reverse(),
      topProducts: topProducts,
      statusMessage: lowStockCount > 0 
        ? `Terdapat ${lowStockCount} produk di bawah batas stok.` 
        : "Seluruh stok tersedia dengan aman.",
      isShopOpen: checkStatus()
    });
  };

  useEffect(() => {
    // Jalankan saat pertama kali load
    refreshData();

    // Otomatis update jika ada perubahan di localStorage (dari tab lain/komponen lain)
    window.addEventListener('storage', refreshData);
    
    // Auto refresh setiap 30 detik untuk update status Buka/Tutup Toko secara real-time
    const interval = setInterval(refreshData, 30000);

    return () => {
      window.removeEventListener('storage', refreshData);
      clearInterval(interval);
    };
  }, []);

  const formatIDR = (val) => {
    const num = Number(val) || 0; // Memastikan input adalah angka
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
    }).format(num);
  };

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4">
               <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter">
                 Dashboard <span className="text-emerald-500">Bisnis</span>
               </h1>
               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border-2 flex items-center gap-2 ${stats.isShopOpen ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                 <span className={`w-2 h-2 rounded-full ${stats.isShopOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                 {stats.isShopOpen ? 'SISTEM AKTIF' : 'SISTEM OFFLINE'}
               </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">Sinkronisasi Real-time Berhasil</p>
          </motion.div>
        </div>

        {/* STATS KARTU */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Omzet", val: formatIDR(stats.totalRevenue), icon: <FiDollarSign />, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Laba Bersih", val: formatIDR(stats.totalProfit), icon: <FiTrendingUp />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Total Transaksi", val: `${stats.totalOrders} Trx`, icon: <FiShoppingBag />, color: "text-violet-500", bg: "bg-violet-500/10" },
            { label: "Stok Kritis", val: `${stats.lowStockItems} Produk`, icon: <FiAlertCircle />, color: "text-rose-500", bg: "bg-rose-500/10", alert: stats.lowStockItems > 0 },
          ].map((card, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <h3 className={`text-2xl font-black dark:text-white tracking-tight ${card.alert ? 'text-rose-600' : ''}`}>{card.val}</h3>
            </motion.div>
          ))}
        </div>

        {/* DATA UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/20">
                <FiClock className="text-emerald-500" />
                <h3 className="font-black dark:text-white uppercase text-xs tracking-widest">Penjualan Terakhir</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b dark:border-slate-800">
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-8 py-5">Metode</th>
                      <th className="px-8 py-5 text-right">Total Tagihan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {stats.recentSales.length > 0 ? stats.recentSales.map((sale, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-black dark:text-white text-sm uppercase">{sale.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(sale.date).toLocaleTimeString('id-ID')} WIB</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase border dark:border-slate-700 dark:text-slate-400">
                            {sale.method}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-emerald-600 text-base">
                          {formatIDR(sale.total)}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-24 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest italic opacity-50">Belum Ada Transaksi Masuk</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black dark:text-white uppercase text-[10px] tracking-widest flex items-center gap-3">
                  <FiActivity className="text-blue-500" /> Rasio Stok
                </h3>
                <span className={`text-xl font-black ${stats.healthPercent < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {stats.healthPercent}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${stats.healthPercent}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full ${stats.healthPercent < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase text-center leading-relaxed italic">
                {stats.statusMessage}
              </p>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-xl relative border border-white/5">
               <h3 className="font-black uppercase text-[10px] tracking-widest mb-6 text-emerald-400 flex items-center gap-2">
                 <FiPieChart /> Top 5 Terlaris
               </h3>
               <div className="space-y-4">
                 {stats.topProducts.length > 0 ? stats.topProducts.map((item, i) => (
                   <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                          {i + 1}
                        </div>
                        <span className="font-black uppercase text-[11px] truncate max-w-[120px]">
                          {item.name}
                        </span>
                     </div>
                     <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full text-emerald-300">
                       {item.qty} Unit
                     </span>
                   </div>
                 )) : (
                   <p className="text-[10px] font-black uppercase opacity-30 text-center py-4">Data belum tersedia</p>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
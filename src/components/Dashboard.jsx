import React, { useState, useEffect, useCallback } from "react";
import { 
  FiShoppingCart, FiBox, 
  FiTrendingUp, FiArrowRight, FiClock 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalTransaksi: 0,
    produkTerlaris: [],
    recentActivity: [],
    growth: 0
  });

  const loadDashboardData = useCallback(() => {
    // KUNCI PENTING: Disamakan dengan halaman Produk dan Kasir
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("sales_history") || "[]");
    
    // 1. Hitung Produk Terlaris
    const productCounts = {};
    savedSales.forEach(sale => {
      if (sale.items) {
        sale.items.forEach(item => {
          productCounts[item.name] = (productCounts[item.name] || 0) + Number(item.qty);
        });
      }
    });

    const sortedProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, qty]) => ({ name, qty }));

    // 2. Ambil Arus Kasir (5 Transaksi Terakhir)
    const recent = savedSales.slice(-5).reverse().map(sale => ({
      id: sale.id || Math.random().toString(36).substr(2, 5).toUpperCase(),
      total: sale.total || 0,
      time: sale.date ? new Date(sale.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : "--:--"
    }));

    // 3. Hitung Growth (Simulasi sederhana dibanding target 100 transaksi)
    const targetTrx = 100;
    const growthCalc = savedSales.length > 0 ? (savedSales.length / targetTrx * 100).toFixed(1) : 0;

    setStats({
      totalProduk: savedProducts.length,
      totalTransaksi: savedSales.length,
      produkTerlaris: sortedProducts,
      recentActivity: recent,
      growth: growthCalc
    });
  }, []);

  useEffect(() => {
    loadDashboardData();

    // Trigger update jika ada perubahan di tab lain
    const handleStorageChange = (e) => {
      if (e.key === "products" || e.key === "sales_history") {
        loadDashboardData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Auto-refresh setiap 3 detik untuk memastikan data di tab yang sama sinkron
    const interval = setInterval(loadDashboardData, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loadDashboardData]);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] pt-10 md:pt-20 pb-32 md:pb-10 px-4 md:px-10 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-8 md:mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-5xl font-black dark:text-white uppercase tracking-tighter text-slate-800 leading-none">
              Warung <span className="text-emerald-500">Digital</span>
            </h1>
            <div className="flex items-center justify-between mt-4">
               <div className="flex items-center gap-3">
                 <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                 </span>
                 <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                  Sistem Aktif & Terpantau
                 </p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <QuickStat 
            label="Gudang Produk" 
            value={`${stats.totalProduk} Item`} 
            icon={<FiBox />} 
            color="emerald" 
          />
          <QuickStat 
            label="Total Transaksi" 
            value={`${stats.totalTransaksi} Trx`} 
            icon={<FiShoppingCart />} 
            color="blue" 
          />
          <QuickStat 
            label="Target Penjualan" 
            value={`${stats.growth}%`} 
            icon={<FiTrendingUp />} 
            color="orange" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* PRODUK TERLARIS */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all h-full">
              <h3 className="text-[10px] font-black dark:text-white uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-2">
                <FiTrendingUp className="text-emerald-500" /> Produk Paling Laku
              </h3>
              
              <div className="space-y-4 md:space-y-6">
                {stats.produkTerlaris.length > 0 ? stats.produkTerlaris.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {i + 1}
                      </div>
                      <p className="text-xs md:text-sm font-black dark:text-white uppercase tracking-tight group-hover:text-emerald-500 transition-colors truncate max-w-[150px] md:max-w-none">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-500">
                        {item.qty}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Unit</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-50 dark:border-slate-800 rounded-3xl">
                    <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">Belum Ada Penjualan</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ARUS KASIR */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all h-full">
              <h3 className="text-[10px] font-black dark:text-white uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-2">
                <FiClock className="text-blue-500" /> Arus Kasir Terakhir
              </h3>
              
              <div className="relative border-l-2 border-slate-50 dark:border-slate-800 ml-2 space-y-8">
                {stats.recentActivity.length > 0 ? stats.recentActivity.map((log, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-[#020617] border-2 border-emerald-500"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black dark:text-white uppercase tracking-tighter">#{log.id}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase">{log.time} WIB</p>
                      </div>
                      <p className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg">
                        {formatIDR(log.total)}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 text-[10px] font-black uppercase italic pl-8">Belum Ada Transaksi</p>
                )}
              </div>

              <button 
                onClick={() => navigate('/laporan')}
                className="w-full mt-10 py-4 bg-slate-900 text-white dark:bg-emerald-500 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Analisis Lengkap <FiArrowRight />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon, color }) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5",
    blue: "bg-blue-500/10 text-blue-500 shadow-blue-500/5",
    orange: "bg-orange-500/10 text-orange-500 shadow-orange-500/5"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-900/50 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
        <h3 className="text-2xl font-black dark:text-white tracking-tighter leading-none truncate">{value}</h3>
      </div>
    </motion.div>
  );
}
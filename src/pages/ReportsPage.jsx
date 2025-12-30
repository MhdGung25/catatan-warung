import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiBarChart2, 
  FiActivity,
  FiShoppingBag,
  FiServer,
  FiDatabase
} from "react-icons/fi";

function ReportsPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalProductsSold: 0,
    averageTransaction: 0
  });
  const [loading, setLoading] = useState(true);

  const calculateRealData = () => {
    const savedTrx = JSON.parse(localStorage.getItem("warung_transactions") || "[]");
    
    let sales = 0;
    let products = 0;

    savedTrx.forEach(trx => {
      sales += trx.total;
      trx.items.forEach(item => {
        products += item.qty;
      });
    });

    setStats({
      totalSales: sales,
      totalTransactions: savedTrx.length,
      totalProductsSold: products,
      averageTransaction: savedTrx.length > 0 ? sales / savedTrx.length : 0
    });
  };

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      calculateRealData();
      setTimeout(() => setLoading(false), 600);
    };

    loadData();
    const interval = setInterval(calculateRealData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    // Tambahkan pb-32 agar konten tidak mentok ke navigasi bawah di HP
    <div className="p-4 md:p-8 min-h-screen bg-slate-50/50 dark:bg-[#0f172a] transition-all font-sans pb-32 md:pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8 mt-6 md:mt-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white tracking-tight">
            Laporan
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
              Live Data Sync
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-32 md:h-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[32px]" />
          ))
        ) : (
          <>
            {/* Card: Omzet */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group transition-all active:scale-95">
              <div className="absolute -top-2 -right-2 opacity-10 text-emerald-600">
                <FiTrendingUp size={80} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Total Omzet</p>
              <h2 className="text-2xl md:text-3xl font-black text-[#1B2559] dark:text-white truncate">
                Rp {stats.totalSales.toLocaleString('id-ID')}
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <FiActivity size={10} className="text-white"/>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Penghasilan Real-time</span>
              </div>
            </div>

            {/* Card: Transaksi */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group transition-all active:scale-95">
              <div className="absolute -top-2 -right-2 opacity-10 text-indigo-600">
                <FiPieChart size={80} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Transaksi</p>
              <h2 className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.totalTransactions} <span className="text-sm font-bold text-slate-400">Struk</span>
              </h2>
              <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase">
                Rata-rata: Rp {Math.floor(stats.averageTransaction).toLocaleString('id-ID')}
              </p>
            </div>

            {/* Card: Item Keluar */}
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group sm:col-span-2 lg:col-span-1 transition-all active:scale-95">
              <div className="absolute -top-2 -right-2 opacity-10 text-orange-500">
                <FiShoppingBag size={80} />
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Produk Terjual</p>
              <h2 className="text-2xl md:text-3xl font-black text-orange-500">
                {stats.totalProductsSold} <span className="text-sm font-bold text-slate-400">Pcs</span>
              </h2>
              <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ANALISIS VISUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Grafik Visual */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-[10px] tracking-[0.2em]">Estimasi Performa</h3>
            <FiBarChart2 className="text-slate-300" size={18} />
          </div>
          <div className="flex items-end gap-3 h-48 px-2">
            {[30, 50, 40, 85, 45, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl relative group cursor-pointer">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-2xl transition-all duration-700 group-hover:scale-y-110 shadow-lg" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase px-1">
              <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
          </div>
        </div>

        {/* Ringkasan & Server Status */}
        <div className="flex flex-col gap-6">
          <div className="p-8 bg-[#1B2559] dark:bg-indigo-950 rounded-[40px] text-white flex flex-col justify-center shadow-xl shadow-indigo-100 dark:shadow-none h-full transition-transform active:scale-[0.98]">
            <h3 className="font-bold text-indigo-300 uppercase text-[9px] tracking-widest mb-3">Health Check</h3>
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              Toko Anda memiliki <span className="text-emerald-400 font-black">{stats.totalTransactions} transaksi</span> terhitung.
              Selalu pantau laporan harian untuk optimasi stok gudang.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/5 flex items-center gap-3">
                <FiServer className="text-emerald-400" />
                <div>
                  <p className="text-[8px] font-black text-indigo-200 uppercase">Status</p>
                  <p className="text-xs font-bold">Aktif</p>
                </div>
              </div>
              <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-sm border border-white/5 flex items-center gap-3">
                <FiDatabase className="text-indigo-300" />
                <div>
                  <p className="text-[8px] font-black text-indigo-200 uppercase">Sync</p>
                  <p className="text-xs font-bold">Local</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
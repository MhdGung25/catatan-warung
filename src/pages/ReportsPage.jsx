import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiBarChart2, 
  FiRefreshCw, 
  FiActivity,
  FiShoppingBag
} from "react-icons/fi";

function ReportsPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalProductsSold: 0,
    averageTransaction: 0
  });
  const [loading, setLoading] = useState(true);

  // 1. FUNGSI UNTUK MENGHITUNG DATA ASLI DARI LOCALSTORAGE
  const calculateRealData = () => {
    // Ambil data transaksi yang disimpan oleh TransactionsPage
    const savedTrx = JSON.parse(localStorage.getItem("warung_transactions") || "[]");
    
    let sales = 0;
    let products = 0;

    savedTrx.forEach(trx => {
      sales += trx.total;
      // Hitung total quantity dari semua item dalam satu transaksi
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

  // 2. LOAD DATA AWAL & REFRESH OTOMATIS
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      calculateRealData();
      setTimeout(() => setLoading(false), 600);
    };

    loadData();

    // Opsional: Cek data baru setiap 10 detik jika user buka dua tab
    const interval = setInterval(calculateRealData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setLoading(true);
    calculateRealData();
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="p-4 pt-24 md:pt-8 md:p-8 min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-all font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white tracking-tight">
            Dashboard Laporan
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
              Live Data Sync
            </p>
          </div>
        </div>
        <button
          onClick={handleManualRefresh}
          className="p-3 bg-white dark:bg-slate-800 text-indigo-600 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:rotate-180 transition-all duration-700 active:scale-90"
          title="Refresh Data"
        >
          <FiRefreshCw size={24} />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          /* Skeleton Loader saat refresh */
          [1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[32px]" />
          ))
        ) : (
          <>
            {/* Total Penjualan */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-600">
                <FiTrendingUp size={100} />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-2">
                Omzet Penjualan
              </p>
              <h2 className="text-3xl font-black text-[#1B2559] dark:text-white">
                Rp {stats.totalSales.toLocaleString('id-ID')}
              </h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                   <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white dark:border-slate-800">
                     <FiActivity size={10} className="text-white"/>
                   </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Terhitung Otomatis</span>
              </div>
            </div>

            {/* Total Transaksi */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-indigo-600">
                <FiPieChart size={100} />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-2">
                Jumlah Transaksi
              </p>
              <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {stats.totalTransactions} <span className="text-sm font-bold text-slate-400">Order</span>
              </h2>
              <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Rata-rata: Rp {Math.floor(stats.averageTransaction).toLocaleString('id-ID')} / Trx
              </p>
            </div>

            {/* Produk Terjual */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-700 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-orange-500">
                <FiShoppingBag size={100} />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mb-2">
                Total Item Keluar
              </p>
              <h2 className="text-3xl font-black text-orange-500">
                {stats.totalProductsSold} <span className="text-sm font-bold text-slate-400">Pcs</span>
              </h2>
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ANALISIS VISUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Grafik Penjualan */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-[40px] border border-slate-50 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.2em]">Performa Mingguan</h3>
            <FiBarChart2 className="text-slate-300" size={20} />
          </div>
          <div className="flex items-end gap-3 h-48">
            {[30, 50, 40, 85, 45, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl relative group cursor-pointer">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-2xl transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110 shadow-lg shadow-indigo-200 dark:shadow-none" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase">
             <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
          </div>
        </div>

        {/* Ringkasan Cepat */}
        <div className="p-8 bg-[#1B2559] dark:bg-indigo-950 rounded-[40px] shadow-2xl shadow-indigo-200 dark:shadow-none text-white flex flex-col justify-center">
          <h3 className="font-bold text-indigo-300 uppercase text-[10px] tracking-widest mb-2">Informasi Toko</h3>
          <p className="text-xl font-medium leading-relaxed">
            Sistem mendeteksi <span className="text-emerald-400 font-black">{stats.totalTransactions} transaksi</span> sukses hari ini. 
            Pastikan stok produk di halaman <span className="underline decoration-indigo-500">Gudang</span> selalu diperbarui.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="bg-white/10 p-4 rounded-3xl flex-1">
              <p className="text-[9px] font-black text-indigo-200 uppercase mb-1">Status Server</p>
              <p className="text-sm font-bold">Terhubung</p>
            </div>
            <div className="bg-white/10 p-4 rounded-3xl flex-1">
              <p className="text-[9px] font-black text-indigo-200 uppercase mb-1">Database</p>
              <p className="text-sm font-bold">LocalStorage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing bawah untuk Mobile Nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}

export default ReportsPage;
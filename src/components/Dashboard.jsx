import React, { useState, useEffect } from "react";
import { FiTrendingUp, FiPackage, FiShoppingCart, FiActivity } from "react-icons/fi";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalTransactions: 0,
    totalItemsSold: 0
  });

  const [loading, setLoading] = useState(true);

  // 1. FUNGSI AMBIL DATA NYATA DARI LOCALSTORAGE
  const syncRealData = () => {
    // Ambil data dari halaman Produk (Gudang)
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    
    // Ambil data dari halaman Transaksi (Kasir)
    const savedTrx = JSON.parse(localStorage.getItem("warung_transactions") || "[]");

    // Hitung total omzet dan item terjual
    let sales = 0;
    let itemsSold = 0;

    savedTrx.forEach(trx => {
      sales += trx.total;
      trx.items.forEach(item => {
        itemsSold += item.qty;
      });
    });

    setStats({
      totalSales: sales,
      totalProducts: savedProducts.length,
      totalTransactions: savedTrx.length,
      totalItemsSold: itemsSold
    });
  };

  // 2. LOAD DATA & AUTO-SYNC
  useEffect(() => {
    // Simulasi loading sebentar agar transisi smooth
    const timer = setTimeout(() => {
      syncRealData();
      setLoading(false);
    }, 800);

    // Sinkronisasi otomatis jika user melakukan transaksi di tab lain
    const interval = setInterval(syncRealData, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4 pt-24 md:pt-8 md:p-8 min-h-screen transition-all bg-slate-50/30 dark:bg-slate-900">
      
      {/* Header Section */}
      <div className="flex flex-col mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-[#1B2559] dark:text-white leading-tight tracking-tighter">
          Dashboard Utama
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-xs md:text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
            Real-time Database Sync
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[32px]" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card Total Penjualan (Dihitung dari Riwayat Transaksi) */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
                <FiTrendingUp size={120} />
              </div>
              <p className="text-[10px] md:text-xs uppercase text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] mb-4">
                Total Omzet
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#2D8B73] tracking-tight mb-2">
                Rp {stats.totalSales.toLocaleString('id-ID')}
              </p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Berdasarkan Kasir</p>
              </div>
            </div>

            {/* Card Produk (Dihitung dari Jumlah Item di Gudang) */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                <FiPackage size={120} />
              </div>
              <p className="text-[10px] md:text-xs uppercase text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] mb-4">
                Jenis Produk
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white mb-2">
                {stats.totalProducts}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Item Terdaftar</p>
            </div>

            {/* Card Transaksi (Dihitung dari Jumlah Nota) */}
            <div className="group p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-orange-500/10 group-hover:text-orange-500/20 transition-colors">
                <FiShoppingCart size={120} />
              </div>
              <p className="text-[10px] md:text-xs uppercase text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] mb-4">
                Total Order
              </p>
              <p className="text-3xl md:text-4xl font-black text-[#7B61FF] mb-2">
                {stats.totalTransactions}
              </p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Transaksi Sukses</p>
            </div>
          </div>

          {/* Bagian Bawah: Info Tambahan Produk Terjual */}
          <div className="bg-[#1B2559] dark:bg-indigo-950 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-200 dark:shadow-none">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-3xl">
                <FiActivity size={32} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-indigo-200 font-bold text-xs uppercase tracking-[0.2em] mb-1">Volume Penjualan</p>
                <h3 className="text-2xl font-black">{stats.totalItemsSold} <span className="text-sm font-normal text-indigo-300">Produk Terjual</span></h3>
              </div>
            </div>
            <div className="h-px md:h-12 w-full md:w-px bg-white/10"></div>
            <div className="text-center md:text-right">
              <p className="text-indigo-200 font-bold text-xs uppercase tracking-[0.2em] mb-1">Status Gudang</p>
              <p className="text-lg font-bold text-emerald-400">Data Terintegrasi</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacing tambahan bawah untuk Navigasi Mobile */}
      <div className="h-28 md:hidden" />
    </div>
  );
}

export default DashboardPage;
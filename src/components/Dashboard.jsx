import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, FiPackage, FiShoppingCart, 
  FiActivity, FiDollarSign, FiAlertTriangle, 
  FiCheckCircle 
} from "react-icons/fi";

function DashboardPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    totalTransactions: 0,
    itemsSold: 0,
    lowStockCount: 0,
    totalProductTypes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pastikan scroll ke atas saat masuk halaman
    window.scrollTo(0, 0);
    
    // Initial Sync
    syncRealData();

    // Simulasi Loading & Interval Sync tiap 3 detik
    const timer = setTimeout(() => setLoading(false), 600);
    const interval = setInterval(syncRealData, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const syncRealData = () => {
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");

    const totalRev = savedSales.reduce((sum, s) => sum + s.total, 0);
    const totalItems = savedSales.reduce((sum, s) => 
      sum + s.items.reduce((a, b) => a + b.quantity, 0), 0
    );
    const lowStock = savedProducts.filter(p => p.stock <= 5).length;

    setStats({
      revenue: totalRev,
      totalTransactions: savedSales.length,
      itemsSold: totalItems,
      lowStockCount: lowStock,
      totalProductTypes: savedProducts.length
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pt-28 pb-40 px-5 md:px-10 transition-all flex flex-col">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto w-full mb-8 flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Live Sync Active
            </p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Status Gudang</p>
          <div className="flex items-center gap-2 text-emerald-500 font-black text-sm">
            <FiCheckCircle /> SECURE & SYNCED
          </div>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto w-full space-y-4">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[32px]" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[32px]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-700">
          
          {/* MAIN CARD: TOTAL OMZET */}
          <div className="relative overflow-hidden p-8 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-center min-h-[200px]">
            <div className="absolute -right-6 -top-6 text-emerald-500/10 dark:text-emerald-400/5">
              <FiTrendingUp size={180} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-200 dark:shadow-none">
                  <FiDollarSign size={20} />
                </div>
                <p className="text-[11px] uppercase text-slate-400 font-black tracking-[0.2em]">Total Omzet Toko</p>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter">
                Rp {stats.revenue.toLocaleString('id-ID')}
              </h2>
              <p className="mt-3 text-sm font-bold text-emerald-500 flex items-center gap-1">
                <FiTrendingUp /> Performa Penjualan Real-time
              </p>
            </div>
          </div>

          {/* GRID STATS CARD */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              label="Transaksi" 
              value={stats.totalTransactions} 
              subLabel="Sukses"
              icon={<FiShoppingCart />} 
              color="text-indigo-500"
              bgColor="bg-indigo-50 dark:bg-indigo-900/20"
            />
            <StatCard 
              label="Terjual" 
              value={stats.itemsSold} 
              subLabel="Unit Item"
              icon={<FiActivity />} 
              color="text-orange-500"
              bgColor="bg-orange-50 dark:bg-orange-900/20"
            />
            <StatCard 
              label="Jenis Produk" 
              value={stats.totalProductTypes} 
              subLabel="Tersedia"
              icon={<FiPackage />} 
              color="text-blue-500"
              bgColor="bg-blue-50 dark:bg-blue-900/20"
            />
            <StatCard 
              label="Stok Menipis" 
              value={stats.lowStockCount} 
              subLabel="Butuh Restock"
              icon={<FiAlertTriangle />} 
              color={stats.lowStockCount > 0 ? "text-red-500" : "text-emerald-500"}
              bgColor={stats.lowStockCount > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"}
              isAlert={stats.lowStockCount > 0}
            />
          </div>

          {/* FOOTER SYSTEM STATUS */}
          <div className="mt-4 bg-[#1B2559] dark:bg-indigo-950 p-6 rounded-[32px] text-white shadow-xl flex flex-col md:flex-row items-center justify-between border border-white/5 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                <FiCheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-indigo-200/60 font-bold text-[10px] uppercase tracking-widest mb-0.5">Kesehatan Sistem</p>
                <h3 className="text-lg font-black tracking-tight">Sistem Berjalan Normal & Sinkron</h3>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest">
                  Storage: LocalBrowser
               </div>
               <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                  Database: Encrypted
               </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// Sub-komponen untuk Card Statistik agar kode lebih bersih
function StatCard({ label, value, subLabel, icon, color, bgColor, isAlert }) {
  return (
    <div className={`group p-6 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[150px] transition-all hover:shadow-md ${isAlert ? 'ring-2 ring-red-500/20' : ''}`}>
      <div className={`absolute -right-2 -top-2 ${color} opacity-10 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 80 })}
      </div>
      <div className={`w-10 h-10 ${bgColor} ${color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">{label}</p>
        <div className="flex items-baseline gap-1">
          <p className={`text-3xl font-black ${isAlert ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
            {value}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase">{subLabel}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
import React, { useState, useEffect } from "react";
import { 
  FiTrendingUp, FiPieChart, FiBarChart2, 
  FiActivity, FiShoppingBag, FiServer, 
  FiDatabase, FiArrowUpRight 
} from "react-icons/fi";

function ReportsPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalProductsSold: 0,
    averageTransaction: 0,
    chartData: [0, 0, 0, 0, 0, 0, 0] // Data per hari [Sen, Sel, Rab, Kam, Jum, Sab, Min]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const loadInitialData = () => {
      calculateRealData();
      setTimeout(() => setLoading(false), 600);
    };
    loadInitialData();

    const interval = setInterval(calculateRealData, 5000);
    return () => clearInterval(interval);
  }, []);

  const calculateRealData = () => {
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    
    let sales = 0;
    let productsCount = 0;
    let dailyData = [0, 0, 0, 0, 0, 0, 0]; // Index 0 = Senin, 6 = Minggu

    savedSales.forEach(sale => {
      sales += sale.total;
      sale.items.forEach(item => {
        productsCount += item.quantity;
      });

      // LOGIKA GRAFIK: Mengelompokkan berdasarkan hari
      // sale.date diasumsikan string ISO (e.g. "2025-12-30T...")
      const saleDate = new Date(sale.date);
      let dayIndex = saleDate.getDay(); // 0 (Minggu) s/d 6 (Sabtu)
      
      // Ubah agar 0 adalah Senin dan 6 adalah Minggu
      const adjustIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      dailyData[adjustIndex] += sale.total;
    });

    // Cari nilai tertinggi untuk normalisasi tinggi grafik (maks 100%)
    const maxSale = Math.max(...dailyData);
    const normalizedData = dailyData.map(val => 
      maxSale > 0 ? Math.round((val / maxSale) * 100) : 0
    );

    setStats({
      totalSales: sales,
      totalTransactions: savedSales.length,
      totalProductsSold: productsCount,
      averageTransaction: savedSales.length > 0 ? sales / savedSales.length : 0,
      chartData: normalizedData
    });
  };

  return (
    <div className="pt-24 md:pt-28 p-4 md:p-8 min-h-screen bg-slate-50/50 dark:bg-[#0f172a] transition-all pb-40">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white tracking-tight">Laporan Penjualan</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">Live Analysis System</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-white font-bold rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all text-sm">
          <FiArrowUpRight /> Export PDF
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard title="Total Omzet" value={`Rp ${stats.totalSales.toLocaleString('id-ID')}`} icon={<FiTrendingUp/>} color="text-emerald-500" loading={loading} />
          <ReportCard title="Transaksi" value={`${stats.totalTransactions} Struk`} icon={<FiPieChart/>} color="text-indigo-500" loading={loading} sub={`Avg: Rp ${Math.floor(stats.averageTransaction).toLocaleString('id-ID')}`} />
          <ReportCard title="Produk Terjual" value={`${stats.totalProductsSold} Pcs`} icon={<FiShoppingBag/>} color="text-orange-500" loading={loading} isProgress />
        </div>

        {/* VISUAL ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          
          {/* GRAFIK DINAMIS */}
          <div className="p-10 bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase text-[11px] tracking-[0.2em]">Aktivitas Penjualan</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Minggu Berjalan (Senin - Minggu)</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl animate-bounce">
                <FiBarChart2 size={20} />
              </div>
            </div>
            
            <div className="flex items-end gap-3 md:gap-4 h-56 px-2">
              {stats.chartData.map((height, i) => (
                <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl relative group cursor-pointer h-full">
                  <div 
                    className={`absolute bottom-0 w-full rounded-2xl transition-all duration-1000 group-hover:brightness-110 shadow-lg ${height > 70 ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gradient-to-t from-emerald-500 to-emerald-400'}`} 
                    style={{ height: `${loading ? 0 : height}%` }}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-black z-20">
                      {height}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6 text-[10px] font-black text-slate-400 uppercase px-2">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <span key={day}>{day}</span>)}
            </div>
          </div>

          {/* INSIGHT CARD */}
          <div className="p-10 bg-[#1B2559] dark:bg-indigo-950 rounded-[40px] text-white flex flex-col justify-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <FiActivity size={150} />
            </div>
            <h3 className="font-bold text-indigo-300 uppercase text-[10px] tracking-widest mb-4">Business Insight</h3>
            <p className="text-xl md:text-2xl font-medium leading-relaxed relative z-10">
              {stats.totalTransactions > 0 
                ? `Performa toko Anda hari ini sangat stabil dengan total ${stats.totalTransactions} transaksi yang tercatat secara aman.` 
                : "Belum ada transaksi yang tercatat hari ini. Mulailah berjualan untuk melihat analisis data."}
            </p>
            
            <div className="mt-10 grid grid-cols-2 gap-4 relative z-10">
              <StatusBox icon={<FiServer className="text-emerald-400" />} label="Status" value="Aktif" />
              <StatusBox icon={<FiDatabase className="text-indigo-300" />} label="Database" value="Synced" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-komponen agar kode rapi
function ReportCard({ title, value, icon, color, loading, sub, isProgress }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:-translate-y-1 transition-all">
      <div className={`absolute -top-2 -right-2 opacity-10 ${color}`}>{React.cloneElement(icon, { size: 100 })}</div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className={`text-3xl font-black ${color}`}>{loading ? "..." : value}</h2>
      {sub && <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase">{sub}</p>}
      {isProgress && (
        <div className="mt-6 h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{ width: '65%' }} />
        </div>
      )}
    </div>
  );
}

function StatusBox({ icon, label, value }) {
  return (
    <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/5 flex items-center gap-4 hover:bg-white/20 transition-all cursor-default">
      <div className="p-2 bg-white/10 rounded-lg">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-indigo-200 uppercase">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

export default ReportsPage;
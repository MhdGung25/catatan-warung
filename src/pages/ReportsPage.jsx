import React, { useState, useEffect, useCallback } from "react";
import { 
  FiShoppingBag, FiArrowUpRight, FiFileText, 
  FiCreditCard, FiTarget, FiTrendingUp, 
  FiLayers
} from "react-icons/fi"; // FiBarChart2, FiDownload, dan FiActivity telah dihapus
import { motion } from "framer-motion";

function ReportsPage() {
  const [filterRange, setFilterRange] = useState("month");
  const [reports, setReports] = useState({
    summary: { revenue: 0, profit: 0, margin: 0, totalSales: 0, avgTicket: 0 },
    paymentMethods: {},
    recentSales: [],
    categoryAnalysis: {}
  });

  const calculateReports = useCallback(() => {
    const savedSales = JSON.parse(localStorage.getItem("sales_history") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    
    const now = new Date();
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfWeek = new Date(new Date().setDate(now.getDate() - now.getDay())).setHours(0,0,0,0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).setHours(0,0,0,0);

    const filteredSales = savedSales.filter(sale => {
      const saleDate = new Date(sale.date);
      if (filterRange === "day") return saleDate >= startOfToday;
      if (filterRange === "week") return saleDate >= startOfWeek;
      if (filterRange === "month") return saleDate >= startOfMonth;
      return true;
    });

    let totalRev = 0;
    let totalProf = 0;
    const payments = {};
    const categories = {};

    filteredSales.forEach(sale => {
      totalRev += Number(sale.total) || 0;
      const method = sale.method || "Tunai";
      payments[method] = (payments[method] || 0) + (Number(sale.total) || 0);

      if (sale.items) {
        sale.items.forEach(item => {
          const product = savedProducts.find(p => p.code === item.id || p.name === item.name);
          const costPrice = product ? Number(product.costPrice || 0) : 0;
          const sellPrice = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;

          const itemProfit = (sellPrice - costPrice) * qty;
          totalProf += itemProfit;

          const cat = product?.category || "Umum";
          if (!categories[cat]) categories[cat] = { sales: 0, profit: 0, qty: 0 };
          categories[cat].sales += (sellPrice * qty);
          categories[cat].profit += itemProfit;
          categories[cat].qty += qty;
        });
      }
    });

    setReports({
      summary: {
        revenue: totalRev,
        profit: totalProf,
        margin: totalRev > 0 ? (totalProf / totalRev) * 100 : 0,
        totalSales: filteredSales.length,
        avgTicket: filteredSales.length > 0 ? totalRev / filteredSales.length : 0
      },
      paymentMethods: payments,
      recentSales: filteredSales.slice().reverse().slice(0, 50),
      categoryAnalysis: categories
    });
  }, [filterRange]);

  useEffect(() => {
    calculateReports();

    const handleStorageChange = (e) => {
      if (e.key === "sales_history" || e.key === "products") {
        calculateReports();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(calculateReports, 3000); // Cek data tiap 3 detik

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [calculateReports]);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10 md:pt-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Statistik Real-time</p>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white uppercase tracking-tighter mb-8">
            REKAP <span className="text-emerald-500">BISNIS</span>
          </h1>
        </motion.div>

        {/* Filter Periode */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border dark:border-slate-800 mb-8 max-w-md">
          {['day', 'week', 'month', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRange(r)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                filterRange === r 
                ? 'bg-white dark:bg-emerald-500 shadow-xl text-emerald-600 dark:text-white' 
                : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              {r === 'day' ? 'Hari' : r === 'week' ? 'Minggu' : r === 'month' ? 'Bulan' : 'Semua'}
            </button>
          ))}
        </div>

        {/* Kartu Utama */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Omzet" value={formatIDR(reports.summary.revenue)} sub="Gross" icon={<FiArrowUpRight />} />
          <StatCard title="Laba" value={formatIDR(reports.summary.profit)} sub={`${reports.summary.margin.toFixed(0)}% Margin`} icon={<FiTrendingUp />} isPrimary />
          <StatCard title="Rata-rata" value={formatIDR(reports.summary.avgTicket)} sub="Per Transaksi" icon={<FiTarget />} />
          <StatCard title="Volume" value={reports.summary.totalSales} sub="Transaksi" icon={<FiShoppingBag />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Riwayat Transaksi */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 dark:text-white">
                  <FiFileText className="text-emerald-500" /> Log Penjualan Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-5 text-left">Waktu</th>
                      <th className="px-8 py-5 text-left">Metode</th>
                      <th className="px-8 py-5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {reports.recentSales.map((sale, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-5 text-xs font-bold dark:text-slate-400">
                          {new Date(sale.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                            {sale.method}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-sm dark:text-white">
                          {formatIDR(sale.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Analisis */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 dark:text-white flex items-center gap-3">
                <FiCreditCard className="text-emerald-500" /> Kas Masuk
              </h3>
              <div className="space-y-6">
                {Object.entries(reports.paymentMethods).map(([method, amount], i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase">{method}</p>
                      <p className="text-sm font-black dark:text-white">{formatIDR(amount)}</p>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${reports.summary.revenue > 0 ? (amount / reports.summary.revenue) * 100 : 0}%` }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 dark:text-white flex items-center gap-3">
                <FiLayers className="text-emerald-500" /> Analisis Kategori
              </h3>
              <div className="space-y-4">
                {Object.entries(reports.categoryAnalysis).map(([cat, data], i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border dark:border-slate-700/50">
                    <div>
                      <p className="text-[9px] font-black text-emerald-500 uppercase">{cat}</p>
                      <h4 className="text-sm font-black dark:text-white">{formatIDR(data.profit)}</h4>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{data.qty} pcs</p>
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

function StatCard({ title, value, sub, icon, isPrimary }) {
  return (
    <div className={`p-6 md:p-8 rounded-[2rem] border transition-all ${
      isPrimary 
      ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isPrimary ? 'bg-white/20' : 'bg-emerald-500/10'}`}>
        {React.cloneElement(icon, { size: 22, className: isPrimary ? "text-white" : "text-emerald-500" })}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isPrimary ? 'text-emerald-100' : 'text-slate-400'}`}>{title}</p>
      <h3 className="text-xl md:text-3xl font-black tracking-tighter truncate mb-2">{value}</h3>
      <p className={`text-[10px] font-bold uppercase opacity-60 ${isPrimary ? 'text-emerald-100' : ''}`}>{sub}</p>
    </div>
  );
}

export default ReportsPage;
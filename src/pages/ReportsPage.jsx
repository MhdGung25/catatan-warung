import React, { useState, useEffect, useCallback } from "react";
import { 
  FiShoppingBag, FiArrowUpRight, FiFileText, 
  FiCreditCard, FiTarget, FiTrendingUp, 
  FiLayers, FiBarChart2 
} from "react-icons/fi";
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
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    
    const now = new Date();
    const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
    const startOfWeek = new Date(new Date().setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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
      payments[sale.method] = (payments[sale.method] || 0) + (Number(sale.total) || 0);

      if (sale.items) {
        sale.items.forEach(item => {
          const product = savedProducts.find(p => p.name === item.name);
          const costPrice = product ? Number(product.costPrice || 0) : 0;
          const qty = Number(item.qty) || 0;
          
          totalProf += (Number(item.price) - costPrice) * qty;

          const cat = product?.category || "Lain-lain";
          if (!categories[cat]) categories[cat] = { sales: 0, profit: 0, qty: 0 };
          categories[cat].sales += (Number(item.price) * qty);
          categories[cat].profit += (Number(item.price) - costPrice) * qty;
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
      recentSales: filteredSales.slice().reverse(),
      categoryAnalysis: categories
    });
  }, [filterRange]);

  useEffect(() => {
    calculateReports();
    window.addEventListener('storage', calculateReports);
    return () => window.removeEventListener('storage', calculateReports);
  }, [calculateReports]);

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(val || 0);

  return (
    <div className="pt-24 md:pt-32 min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER ANALISIS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white uppercase tracking-tighter">
              Business <span className="text-emerald-500">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic flex items-center gap-2">
              <FiBarChart2 className="text-emerald-500" /> Evaluasi Strategis & Laba Bersih
            </p>
          </motion.div>

          {/* FILTER PERIODE (EMERALD STYLE) */}
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
            {[
              { id: 'day', label: 'Hari Ini' },
              { id: 'week', label: 'Minggu' },
              { id: 'month', label: 'Bulan' },
              { id: 'all', label: 'Semua' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setFilterRange(range.id)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filterRange === range.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-slate-400 hover:text-emerald-500'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* METRIK UTAMA (EMERALD THEMED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Omzet" value={formatIDR(reports.summary.revenue)} sub="Pendapatan Kotor" icon={<FiArrowUpRight />} color="emerald" />
          <StatCard title="Laba Bersih" value={formatIDR(reports.summary.profit)} sub={`Margin: ${reports.summary.margin.toFixed(1)}%`} icon={<FiTrendingUp />} color="emerald" highlight />
          <StatCard title="Rata-rata Transaksi" value={formatIDR(reports.summary.avgTicket)} sub="Nilai per Struk" icon={<FiTarget />} color="emerald" />
          <StatCard title="Volume Sales" value={`${reports.summary.totalSales} Trx`} sub="Total Pesanan" icon={<FiShoppingBag />} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ANALISIS KATEGORI (LEFT) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-emerald-50/30 dark:bg-emerald-900/10">
                <div className="flex items-center gap-3">
                  <FiLayers className="text-emerald-500" />
                  <h3 className="font-black dark:text-white uppercase text-xs tracking-widest">Performansi Kategori</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(reports.categoryAnalysis).map(([cat, data], i) => (
                    <div key={i} className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 hover:border-emerald-500/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">{cat}</span>
                        <span className="text-[9px] font-bold text-slate-400 italic">{data.qty} Unit</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Profit Kontribusi</p>
                        <h4 className="text-xl font-black dark:text-white">{formatIDR(data.profit)}</h4>
                      </div>
                      <div className="mt-4 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${reports.summary.profit > 0 ? (data.profit / reports.summary.profit) * 100 : 0}%` }}
                          className="h-full bg-emerald-500" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AUDIT LOG (GREEN ACCENT) */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-black dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
                  <FiFileText className="text-emerald-500" /> Log Transaksi
                </h3>
                <button className="text-[10px] font-black uppercase text-emerald-500 hover:text-emerald-600 transition-colors">Export CSV</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-emerald-50/30 dark:bg-emerald-900/10">
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-8 py-4">Waktu</th>
                      <th className="px-8 py-4">ID Transaksi</th>
                      <th className="px-8 py-4">Metode</th>
                      <th className="px-8 py-4 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {reports.recentSales.map((sale, i) => (
                      <tr key={i} className="hover:bg-emerald-50/20 dark:hover:bg-emerald-900/5 transition-colors">
                        <td className="px-8 py-4 text-[10px] font-bold text-slate-400">{new Date(sale.date).toLocaleTimeString('id-ID')}</td>
                        <td className="px-8 py-4 text-[10px] font-black dark:text-white uppercase">{sale.id}</td>
                        <td className="px-8 py-4">
                          <span className="text-[9px] font-black px-2 py-1 rounded bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20 uppercase">
                            {sale.method}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-xs">{formatIDR(sale.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SIDEBAR ANALYTICS (RIGHT) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* KAS (GREEN THEMED) */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-black dark:text-white uppercase text-[10px] tracking-widest mb-8 flex items-center gap-3">
                <FiCreditCard className="text-emerald-500" /> Arus Kas
              </h3>
              <div className="space-y-6">
                {Object.entries(reports.paymentMethods).map(([method, amount], i) => (
                  <div key={i} className="relative">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{method}</p>
                        <p className="text-sm font-black dark:text-white">{formatIDR(amount)}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500">{reports.summary.revenue > 0 ? ((amount / reports.summary.revenue) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${reports.summary.revenue > 0 ? (amount / reports.summary.revenue) * 100 : 0}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADVISORY BOX (FULL GREEN) */}
            <div className="bg-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                  <FiTarget className="text-emerald-200" /> Health Check
                </h3>
                <p className="text-xs leading-relaxed font-medium text-emerald-50">
                  Margin profit Anda saat ini berada di angka <b>{reports.summary.margin.toFixed(1)}%</b>. 
                  <br /><br />
                  Sistem menyarankan untuk menjaga rasio kas pada metode <b>Cash</b> tetap di atas 40% untuk menjamin kelancaran operasional harian.
                </p>
                <button className="mt-8 w-full py-4 bg-white text-emerald-600 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-50 transition-all shadow-lg">
                  Cetak Laporan Lengkap
                </button>
              </div>
              <FiTrendingUp className="absolute -bottom-10 -right-10 text-white/10 w-48 h-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon, color, highlight }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-[2.5rem] border shadow-sm transition-all ${
        highlight 
        ? 'bg-emerald-600 border-emerald-500 shadow-emerald-500/20' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
      }`}
    >
      <div className={`${highlight ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-emerald-100' : 'text-slate-400'}`}>{title}</p>
      <h3 className={`text-2xl font-black tracking-tight ${highlight ? 'text-white' : 'dark:text-white'}`}>{value}</h3>
      <p className={`text-[10px] font-bold mt-2 italic ${highlight ? 'text-emerald-200' : 'text-slate-500'}`}>{sub}</p>
    </motion.div>
  );
}

export default ReportsPage;
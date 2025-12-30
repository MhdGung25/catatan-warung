import React, { useState, useEffect, useCallback } from "react";
import { 
  FiTrendingUp, FiPieChart, FiShoppingBag, 
  FiBarChart2, FiPrinter 
} from "react-icons/fi";
import { motion } from "framer-motion";

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("week");
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    totalProductsSold: 0,
    chartData: []
  });

  const calculateData = useCallback(() => {
    const savedSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    const now = new Date();
    
    let totalSales = 0;
    let productsCount = 0;
    let transactionsCount = 0;
    let dataMap = {};
    let labels = [];

    if (filter === "week") {
      labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      labels.forEach(l => dataMap[l] = 0);
      savedSales.forEach(sale => {
        const d = new Date(sale.date);
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0,0,0,0);
        if (d >= startOfWeek) {
          totalSales += sale.total;
          transactionsCount++;
          sale.items.forEach(i => productsCount += i.quantity);
          let dayIdx = d.getDay();
          dataMap[labels[dayIdx === 0 ? 6 : dayIdx - 1]] += sale.total;
        }
      });
    } else if (filter === "month") {
      labels = ['Mgg 1', 'Mgg 2', 'Mgg 3', 'Mgg 4'];
      labels.forEach(l => dataMap[l] = 0);
      savedSales.forEach(sale => {
        const d = new Date(sale.date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          totalSales += sale.total;
          transactionsCount++;
          sale.items.forEach(i => productsCount += i.quantity);
          const date = d.getDate();
          let weekKey = date > 21 ? 'Mgg 4' : date > 14 ? 'Mgg 3' : date > 7 ? 'Mgg 2' : 'Mgg 1';
          dataMap[weekKey] += sale.total;
        }
      });
    } else {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      labels.forEach(l => dataMap[l] = 0);
      savedSales.forEach(sale => {
        const d = new Date(sale.date);
        if (d.getFullYear() === now.getFullYear()) {
          totalSales += sale.total;
          transactionsCount++;
          sale.items.forEach(i => productsCount += i.quantity);
          dataMap[labels[d.getMonth()]] += sale.total;
        }
      });
    }

    const maxVal = Math.max(...Object.values(dataMap));
    const normalized = labels.map(label => ({
      label,
      value: dataMap[label],
      height: maxVal > 0 ? (dataMap[label] / maxVal) * 100 : 0
    }));

    setStats({ totalSales, totalTransactions: transactionsCount, totalProductsSold: productsCount, chartData: normalized });
  }, [filter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setLoading(false), 500);
    calculateData();
    window.addEventListener('storage', calculateData);
    return () => window.removeEventListener('storage', calculateData);
  }, [calculateData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-24 pt-24 md:pt-32 px-4 md:px-8">
      {/* CSS KHUSUS PRINT */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          nav, .no-print, button { display: none !important; }
          .min-h-screen { padding: 0 !important; margin: 0 !important; }
          .max-w-5xl { max-width: 100% !important; }
          .shadow-sm, .shadow-lg { shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .bg-slate-50, .dark\\:bg-\\[\\#020617\\] { background: white !important; }
          .grid { display: flex !important; gap: 10px !important; }
          .grid > div { flex: 1 !important; border: 1px solid #eee !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .chart-container { height: 300px !important; margin-top: 50px !important; }
        }
      `}} />

      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">
              Laporan Analisis Penjualan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Periode: <span className="text-emerald-500 font-bold uppercase">{filter === 'week' ? 'Minggu Ini' : filter === 'month' ? 'Bulan Ini' : 'Tahun Ini'}</span> 
              <span className="ml-2 no-print">• Diperbarui otomatis setiap ada transaksi baru.</span>
            </p>
          </div>
          
          <div className="flex gap-2 no-print">
            <button onClick={() => window.print()} className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
              <FiPrinter size={18} />
            </button>
            <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1 rounded-xl">
              {['week', 'month', 'year'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    filter === type ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {type === 'week' ? 'Minggu' : type === 'month' ? 'Bulan' : 'Tahun'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ReportCard title="Total Pendapatan" value={`Rp ${stats.totalSales.toLocaleString('id-ID')}`} icon={<FiTrendingUp/>} color="text-emerald-500" loading={loading} />
          <ReportCard title="Total Transaksi" value={`${stats.totalTransactions} Struk`} icon={<FiPieChart/>} color="text-blue-500" loading={loading} />
          <ReportCard title="Produk Terjual" value={`${stats.totalProductsSold} Pcs`} icon={<FiShoppingBag/>} color="text-orange-500" loading={loading} />
        </div>

        {/* CHART SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 chart-container"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><FiBarChart2 size={20} /></div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase">Visualisasi Omzet Harian</h3>
          </div>

          <div className="flex items-end gap-2 md:gap-4 h-64 px-2">
            {stats.chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full group">
                <div className="relative w-full h-full bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${loading ? 0 : data.height}%` }}
                    className={`w-full rounded-t-lg transition-all ${data.height > 80 ? 'bg-emerald-500' : 'bg-emerald-400/60'}`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold no-print">
                      Rp {data.value.toLocaleString('id-ID')}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{data.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FOOTER PREMIUM - Muncul saat print */}
        <div className="mt-16 text-center">
           <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">
             Warung POS Cloud Intelligence • Dicetak pada {new Date().toLocaleString('id-ID')}
           </p>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value, icon, color, loading }) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
      <div className={`absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-[0.08] ${color}`}>
        {React.cloneElement(icon, { size: 80 })}
      </div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
        {loading ? <div className="h-7 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" /> : value}
      </h2>
    </div>
  );
}

export default ReportsPage;
import React, { useState, useEffect, useCallback } from "react";
import { 
  FiTrendingUp, FiPieChart, FiShoppingBag, 
  FiBarChart2, FiPrinter, FiInfo 
} from "react-icons/fi";
import { motion } from "framer-motion";

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("week");
  // Mengambil nama toko dari settings (default: Warung Digital)
  const [shopName, setShopName] = useState(localStorage.getItem("shop_name") || "Warung Digital");
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

    // Logika perhitungan berdasarkan filter (Week/Month/Year)
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

    // Listener untuk mendeteksi perubahan dari Settings (seperti Nama Toko)
    const handleStorageChange = () => {
      setShopName(localStorage.getItem("shop_name") || "Warung Digital");
      calculateData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [calculateData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-24 pt-24 md:pt-32 px-4 md:px-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 1cm; }
          body { background: white !important; }
          nav, .no-print, button { display: none !important; }
          .min-h-screen { padding: 0 !important; margin: 0 !important; }
          .max-w-5xl { max-width: 100% !important; }
          .shadow-sm, .shadow-lg { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .bg-slate-50, .dark\\:bg-\\[\\#020617\\] { background: white !important; }
          .grid { display: grid !important; grid-template-cols: repeat(3, 1fr) !important; gap: 10px !important; }
          .chart-container { height: 400px !important; margin-top: 30px !important; border: 1px solid #eee !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      <div className="max-w-5xl mx-auto">
        {/* HEADER LAPORAN */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Official Report</span>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shopName}</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
              Analisis Penjualan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Periode: <span className="text-emerald-500 font-bold uppercase">{filter === 'week' ? 'Minggu Ini' : filter === 'month' ? 'Bulan Ini' : 'Tahun Ini'}</span> 
            </p>
          </div>
          
          <div className="flex gap-2 no-print">
            <button 
              onClick={() => window.print()} 
              className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all active:scale-90"
              title="Cetak Laporan"
            >
              <FiPrinter size={20} />
            </button>
            <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1.5 rounded-2xl border dark:border-slate-800">
              {['week', 'month', 'year'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    filter === type ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {type === 'week' ? 'Minggu' : type === 'month' ? 'Bulan' : 'Tahun'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* INFO BOX (TERKONEKSI SETTINGS) */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-center gap-4 no-print">
          <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shrink-0">
            <FiInfo size={20} />
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
            Laporan ini disinkronkan secara real-time dengan database lokal Anda. Anda dapat mengubah preferensi tampilan di halaman <strong>Settings</strong>.
          </p>
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
          className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm chart-container"
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl"><FiBarChart2 size={22} /></div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Tren Omzet Penjualan</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 italic">Data berdasarkan nilai transaksi kotor</span>
          </div>

          <div className="flex items-end gap-2 md:gap-4 h-72 px-2 relative">
            {/* Garis Bantu Horizontal */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-slate-900 dark:border-white" />)}
            </div>

            {stats.chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full group z-10">
                <div className="relative w-full h-full flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${loading ? 0 : data.height}%` }}
                    className={`w-full rounded-t-xl transition-all relative ${data.height > 80 ? 'bg-emerald-500' : 'bg-emerald-400/40 group-hover:bg-emerald-400'}`}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-emerald-600 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-black shadow-xl no-print">
                      Rp {data.value.toLocaleString('id-ID')}
                    </div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-500 transition-colors uppercase">{data.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FOOTER PRINT */}
        <div className="mt-16 text-center border-t border-dashed border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">
              {shopName} POS Intelligence System
            </p>
            <p className="text-[9px] text-slate-400 mt-2">
              Generated on {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
      </div>
    </div>
  );
}

function ReportCard({ title, value, icon, color, loading }) {
  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
      <div className={`absolute -top-4 -right-4 opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500 ${color}`}>
        {React.cloneElement(icon, { size: 100 })}
      </div>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
        {loading ? <div className="h-8 w-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" /> : value}
      </h2>
      <div className={`w-10 h-1 mt-4 rounded-full ${color.replace('text', 'bg')} opacity-20`} />
    </div>
  );
}

export default ReportsPage;
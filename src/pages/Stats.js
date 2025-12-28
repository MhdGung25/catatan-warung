import React from 'react';

function Stats({ transaksi, totalPendapatan }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Penjualan</p>
          <h4 className="text-3xl font-black text-slate-800 mt-2">{transaksi.length}</h4>
        </div>
        
        <div className="bg-[#2D8B73] p-6 rounded-[2rem] text-white shadow-lg shadow-emerald-100">
          <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Total Omzet</p>
          <h4 className="text-2xl font-black mt-2">Rp {totalPendapatan.toLocaleString('id-ID')}</h4>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rata-rata Transaksi</p>
          <h4 className="text-2xl font-black text-slate-800 mt-2">
            Rp {transaksi.length > 0 ? Math.round(totalPendapatan / transaksi.length).toLocaleString('id-ID') : 0}
          </h4>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="font-black text-slate-800 text-xl">Grafik Mingguan</h3>
        <p className="text-slate-400 text-sm mt-2">Data visualisasi sedang disiapkan untuk akun Anda.</p>
      </div>
    </div>
  );
}

export default Stats;
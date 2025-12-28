import React from 'react';
// Pastikan path ini benar: keluar dari pages, masuk ke components
import FormInput from '../components/FormInput';
import ListTransaksi from '../components/ListTransaksi';

function Home({ 
  transaksi = [], 
  handleTambah, 
  handleHapus, 
  filterTanggal, 
  setFilterTanggal, 
  totalPendapatan = 0, 
  handlePrint 
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* Bagian Utama: Form & List */}
      <div className="flex-1 space-y-6 md:space-y-8 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h3 className="font-bold text-xl md:text-2xl text-slate-800">Manajemen Transaksi</h3>
            <p className="text-slate-400 text-xs md:text-sm">Kelola penjualan hari ini</p>
          </div>
          <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pilih Tanggal</span>
            <input 
              type="date" 
              className="w-full sm:w-auto bg-white px-4 py-2 rounded-xl shadow-sm text-emerald-600 font-bold border-none outline-none cursor-pointer"
              value={filterTanggal} 
              onChange={(e) => setFilterTanggal(e.target.value)} 
            />
          </div>
        </div>

        {/* Form Input Barang */}
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-50">
          <FormInput onTambah={handleTambah} />
        </section>

        {/* Tabel/List Riwayat Transaksi */}
        <section className="bg-white p-2 md:p-4 rounded-[2rem] shadow-sm border border-slate-50 min-h-[200px]">
          <ListTransaksi data={transaksi} onHapus={handleHapus} />
        </section>
      </div>

      {/* Sidebar Ringkasan (Kanan) */}
      <aside className="w-full lg:w-80 xl:w-96 no-print">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/40 lg:sticky lg:top-10 border border-white">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-black">Ringkasan</h2>
            <span className="bg-emerald-50 text-emerald-600 p-2 rounded-lg text-lg">💰</span>
          </div>
          
          <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-dashed border-slate-100">
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span className="text-xs uppercase tracking-widest">Total Item</span>
              <span className="text-slate-800 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold">
                {transaksi?.length || 0}
              </span>
            </div>
            
            <div className="bg-emerald-50/50 p-5 md:p-6 rounded-3xl border border-emerald-100/50">
              <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-black">Total Pendapatan</span>
              <h4 className="text-2xl md:text-3xl font-black text-[#2D8B73] mt-1 break-all">
                Rp {totalPendapatan.toLocaleString('id-ID')}
              </h4>
            </div>
          </div>

          <button 
            onClick={handlePrint}
            className="w-full mt-6 md:mt-10 py-4 md:py-5 bg-[#2D8B73] text-white rounded-[1.2rem] font-black shadow-lg shadow-emerald-100 hover:bg-[#246e5b] transition-all active:scale-95 text-[10px] md:text-xs tracking-widest uppercase"
          >
            Cetak Struk Warung
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Home;
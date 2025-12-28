import React from 'react';

function ListTransaksi({ data, onHapus }) {
  // Tampilan jika data kosong
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-5xl mb-4 opacity-20">📝</div>
        <h4 className="text-slate-800 font-bold uppercase text-[10px] tracking-[0.2em]">Belum Ada Data</h4>
        <p className="text-slate-400 text-xs mt-1 max-w-[200px]">Silahkan masukkan transaksi pertama Anda di atas.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* HEADER LIST (Hanya muncul di desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="col-span-5">Barang</div>
        <div className="col-span-2 text-center">Jumlah</div>
        <div className="col-span-3 text-right">Subtotal</div>
        <div className="col-span-2 text-right">Aksi</div>
      </div>

      {/* BODY LIST */}
      <div className="divide-y divide-slate-50">
        {data.map((item) => (
          <div 
            key={item.id} 
            className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group"
          >
            {/* Nama Barang & Info di Mobile */}
            <div className="col-span-1 md:col-span-5 flex flex-col">
              <span className="text-sm font-bold text-slate-700 leading-tight">
                {item.namaBarang}
              </span>
              <span className="md:hidden text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                Rp {item.harga?.toLocaleString('id-ID')} × {item.jumlah} item
              </span>
            </div>

            {/* Jumlah (Desktop Only) */}
            <div className="hidden md:block col-span-2 text-center">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-black">
                {item.jumlah}
              </span>
            </div>

            {/* Subtotal */}
            <div className="col-span-1 md:col-span-3 text-left md:text-right">
              <span className="text-sm font-black text-[#2D8B73]">
                Rp {item.total?.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Tombol Hapus */}
            <div className="col-span-1 md:col-span-2 text-right">
              <button
                onClick={() => onHapus(item.id)}
                className="w-full md:w-auto p-2 md:p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span className="text-sm md:text-base">🗑️</span>
                <span className="md:hidden text-[10px] font-black uppercase">Hapus Transaksi</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListTransaksi;
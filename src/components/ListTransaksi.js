import React from 'react';

function ListTransaksi({ data, onHapus }) {
  // 1. TAMPILAN JIKA DATA SEDANG KOSONG
  if (!data || data.length === 0) {
    return (
      <div className="relative overflow-hidden bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center group">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="text-5xl mb-4 grayscale opacity-50">📡</div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
            No Data Packets Found
          </h3>
          <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase tracking-widest">
            Waiting for incoming data stream...
          </p>
        </div>
      </div>
    );
  }

  // 2. TAMPILAN JIKA ADA DATA
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div 
          key={item.id} 
          className="group relative bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex justify-between items-center hover:border-indigo-500/50 transition-all duration-300"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-indigo-500 transition-all duration-300 rounded-r-full"></div>

          <div className="flex flex-col ml-2">
            {/* PASTIKAN NAMA FIELD SESUAI: namaBarang */}
            <span className="text-xs font-black text-white tracking-widest uppercase mb-1">
              {item.namaBarang || "Unknown Item"}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-950 text-[9px] font-bold text-emerald-500 rounded-md border border-slate-800 uppercase">
                {item.jumlah || 0} Unit
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                @ Rp{(item.harga || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter mb-0.5 opacity-70">Subtotal</p>
              <p className="text-sm font-black text-white font-mono">
                Rp{(item.total || 0).toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={() => onHapus(item.id)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500 border border-red-500/20 md:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListTransaksi;
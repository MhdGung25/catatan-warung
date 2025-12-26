import React, { useState } from 'react';

function FormInput({ onTambah }) {
  const [formData, setFormData] = useState({ nama: '', harga: '', jumlah: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.harga || !formData.jumlah) return;
    onTambah(formData);
    setFormData({ nama: '', harga: '', jumlah: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-[2rem] space-y-4 shadow-xl">
      <div className="grid grid-cols-1 gap-4">
        {/* Input Nama Barang */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Item Name</label>
          <input
            type="text"
            placeholder="E.g. Cyber Drink v1"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all text-slate-200"
            value={formData.nama}
            onChange={(e) => setFormData({...formData, nama: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Input Harga */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Unit Price</label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-slate-200"
              value={formData.harga}
              onChange={(e) => setFormData({...formData, harga: e.target.value})}
            />
          </div>
          {/* Input Jumlah */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Quantity</label>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-slate-200"
              value={formData.jumlah}
              onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all mt-2"
      >
        + Commit Transaction
      </button>
    </form>
  );
}

export default FormInput;
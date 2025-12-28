import React, { useState } from 'react';

function FormInput({ onTambah }) {
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    jumlah: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!formData.nama || !formData.harga || !formData.jumlah) {
      alert("Mohon isi semua kolom!");
      return;
    }

    // Kirim data ke fungsi handleTambah di Dashboard
    onTambah(formData);

    // Reset form setelah input
    setFormData({ nama: '', harga: '', jumlah: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Input Nama Barang */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Nama Barang
          </label>
          <input
            type="text"
            placeholder="Contoh: Kopi Susu"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
        </div>

        {/* Input Harga */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Harga Satuan
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
            <input
              type="number"
              placeholder="0"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-11 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.harga}
              onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
            />
          </div>
        </div>

        {/* Input Jumlah */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Jumlah
          </label>
          <input
            type="number"
            placeholder="1"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={formData.jumlah}
            onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
          />
        </div>

      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        className="w-full md:w-max px-10 py-4 bg-[#2D8B73] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-[#236e5a] active:scale-95 transition-all mt-2"
      >
        Tambah Transaksi ＋
      </button>
    </form>
  );
}

export default FormInput;
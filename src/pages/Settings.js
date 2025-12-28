import React, { useState, useEffect } from 'react';

function Settings({ user, onLogout, namaWarung, setNamaWarung }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNama, setTempNama] = useState(namaWarung);

  // Memastikan tempNama selalu sinkron saat namaWarung di Dashboard berubah
  useEffect(() => {
    setTempNama(namaWarung);
  }, [namaWarung]);

  const handleSave = () => {
    // VALIDASI: Menghapus spasi di awal/akhir dan cek apakah kosong
    const namaBersih = tempNama.trim();
    
    if (namaBersih === "") {
      alert("Nama warung tidak boleh kosong!");
      setTempNama(namaWarung); // Kembalikan ke nama asli jika kosong
      return;
    }

    setNamaWarung(namaBersih); // Update state di Dashboard
    localStorage.setItem('namaWarung', namaBersih); // Simpan di memori
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempNama(namaWarung); // Reset input ke nama sebelumnya
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Kartu Profil User */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-4xl flex items-center justify-center rounded-full mx-auto mb-4 border-4 border-white shadow-sm">
          👤
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          {user?.email?.split('@')[0]}
        </h3>
        <p className="text-slate-400 text-sm font-medium">{user?.email}</p>
      </div>

      {/* Kartu Pengaturan Warung */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 space-y-6">
        <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
          Pengaturan Profil Warung
        </h4>
        
        <div className="space-y-2">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                value={tempNama} 
                onChange={(e) => setTempNama(e.target.value)}
                placeholder="Masukkan nama warung..."
                className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-emerald-500 outline-none font-bold text-slate-700"
                autoFocus
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave} 
                  className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 transition-transform active:scale-95"
                >
                  Simpan Perubahan
                </button>
                <button 
                  onClick={handleCancel} 
                  className="px-6 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase transition-transform active:scale-95"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full p-5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-left flex justify-between items-center group hover:bg-slate-100 transition-all"
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase mb-1">Nama Warung Saat Ini:</span>
                <span className="text-slate-800">{namaWarung}</span>
              </div>
              <span className="text-emerald-500 font-black text-[10px] uppercase flex items-center gap-2">
                Ubah <span className="text-lg">✏️</span>
              </span>
            </button>
          )}
        </div>

        {/* Tombol Logout */}
        <div className="pt-4 border-t border-slate-50">
          <button 
            onClick={onLogout} 
            className="w-full p-5 bg-red-50 text-red-500 rounded-2xl font-black text-center hover:bg-red-500 hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-sm shadow-red-50"
          >
            Keluar dari Aplikasi 🚪
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
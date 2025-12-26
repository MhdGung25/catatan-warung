import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, deleteDoc, where, Timestamp 
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import FormInput from './FormInput';
import ListTransaksi from './ListTransaksi';

function Dashboard({ user }) {
  const [transaksi, setTransaksi] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    setIsLoaded(true);

    const start = new Date(filterTanggal);
    start.setHours(0, 0, 0, 0);
    const end = new Date(filterTanggal);
    end.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, "penjualan"),
      where("userId", "==", user.uid),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listData = snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      }));
      setTransaksi(listData);
    }, (err) => {
      console.error("Firestore Error:", err.message);
    });

    return () => unsubscribe();
  }, [filterTanggal, user]);

  const handleTambah = async (formData) => {
    try {
      await addDoc(collection(db, "penjualan"), {
        namaBarang: formData.nama,
        harga: Number(formData.harga),
        jumlah: Number(formData.jumlah),
        total: Number(formData.harga) * Number(formData.jumlah),
        createdAt: serverTimestamp(),
        userId: user.uid 
      });
    } catch (e) { alert("Sistem Error: Gagal input data"); }
  };

  const handleHapus = async (id) => {
    if (window.confirm("Hapus data dari memori?")) {
      await deleteDoc(doc(db, "penjualan", id));
    }
  };

  const totalPendapatan = transaksi.reduce((acc, item) => acc + (item.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* MODAL LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
            {/* Logo di Modal */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-red-500/20 flex items-center justify-center border border-white/5 relative group">
                <img src="/logo192.png" alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <h3 className="text-xl font-black tracking-tighter text-white mb-2">TERMINATE SESSION?</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-8 leading-relaxed">
              Anda akan keluar dari terminal <br/> sistem yang aman.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-4 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">Aborted</button>
              <button onClick={() => signOut(auth)} className="flex-1 py-4 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-900/40 hover:bg-red-500 transition-all active:scale-95">Confirm Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-4 group cursor-pointer">
          {/* Logo Warung */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all overflow-hidden">
              <img src="/logo192.png" alt="Warung Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-black tracking-tighter text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              CATATAN WARUNG
            </h1>
            <span className="text-[8px] font-black text-emerald-400/60 uppercase tracking-[0.3em] -mt-1">Digital Terminal</span>
          </div>
        </div>
        
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="group flex items-center gap-3 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 active:scale-90"
        >
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`max-w-2xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* STATS & FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-5 flex flex-col justify-center gap-3 hover:border-emerald-500/30 transition-all group">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Date</span>
            <input 
              type="date" 
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-400 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer invert-[0.1]"
              value={filterTanggal} 
              onChange={(e) => setFilterTanggal(e.target.value)} 
            />
          </div>

          <div className="relative overflow-hidden bg-slate-900 border border-indigo-500/20 p-6 rounded-3xl shadow-xl group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-7xl group-hover:rotate-12 transition-transform duration-700">💰</div>
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Total Revenue Stream</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-indigo-500 font-black text-sm">Rp</span>
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {totalPendapatan.toLocaleString()}
              </h2>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* MODULES */}
        <div className="space-y-14">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <span className="text-xs">📥</span>
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Input Module</h3>
              <div className="flex-1 h-[1px] bg-slate-800/50"></div>
            </div>
            <div className="bg-slate-900/10 p-1 rounded-[2.5rem] border border-slate-800/30 backdrop-blur-sm">
              <FormInput onTambah={handleTambah} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="text-xs">📋</span>
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Transaction History</h3>
              <div className="flex-1 h-[1px] bg-slate-800/50"></div>
            </div>
            <ListTransaksi data={transaksi} onHapus={handleHapus} />
          </section>
        </div>
      </main>

      <footer className="mt-24 py-12 border-t border-slate-900/50 text-center">
        <img src="/logo192.png" alt="Footer Logo" className="w-6 h-6 mx-auto mb-4 opacity-20 grayscale" />
        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.5em]">
          &copy; 2025 Catatan Warung &bull; Core Terminal v2.4.0
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, deleteDoc, where, Timestamp 
} from "firebase/firestore";
import { signOut } from "firebase/auth";

import Sidebar from './Sidebar'; 
import Home from '../pages/Home';
import Stats from '../pages/Stats';
import Settings from '../pages/Settings';

function Dashboard({ user }) {
  const [transaksi, setTransaksi] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // State Nama Warung (Agar otomatis update saat diedit di Settings)
  const [namaWarung, setNamaWarung] = useState(localStorage.getItem('namaWarung') || 'Warung Saya');

  useEffect(() => {
    if (!user) return;
    const selectedDate = new Date(filterTanggal);
    const start = new Date(selectedDate.setHours(0, 0, 0, 0));
    const end = new Date(selectedDate.setHours(23, 59, 59, 999));

    const q = query(
      collection(db, "penjualan"),
      where("userId", "==", user.uid),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTransaksi(listData);
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
    } catch (e) { alert("Gagal input data!"); }
  };

  const handleHapus = async (id) => {
    if (window.confirm("Hapus transaksi ini?")) {
      try { await deleteDoc(doc(db, "penjualan", id)); } 
      catch (e) { alert("Gagal menghapus!"); }
    }
  };

  const totalPendapatan = transaksi.reduce((acc, item) => acc + (item.total || 0), 0);
  const handlePrint = () => window.print();

  const renderCurrentPage = () => {
    const homeProps = { transaksi, handleTambah, handleHapus, filterTanggal, setFilterTanggal, totalPendapatan, handlePrint };

    switch (activeTab) {
      case 'home':
        return <Home {...homeProps} />;
      case 'stats':
        return <Stats transaksi={transaksi} totalPendapatan={totalPendapatan} />;
      case 'settings':
        return (
          <Settings 
            user={user} 
            onLogout={() => setShowLogoutConfirm(true)} 
            namaWarung={namaWarung} 
            setNamaWarung={setNamaWarung} 
          />
        );
      default:
        return <Home {...homeProps} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFA] font-sans text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-4 md:p-12 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
        {/* Header Updated: Tanggal dihapus, Nama Warung Sinkron */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black mb-1 uppercase tracking-[0.2em]">
              <span className="w-6 h-[2px] bg-emerald-500 rounded-full"></span>
              Akses: {namaWarung}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter leading-tight">
              Catatan <span className="text-[#2D8B73]">Warung</span>
            </h1>
          </div>
          
          {/* Tanggal sudah dihapus dari sini */}
        </header>

        {renderCurrentPage()}

        {/* Komponen Cetak Struk */}
        <div className="print-only">
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ textTransform: 'uppercase' }}>{namaWarung}</h2>
            <p>{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
            <hr style={{ border: '1px dashed #000' }} />
          </div>
          <div style={{ margin: '15px 0' }}>
            {transaksi.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{item.namaBarang} ({item.jumlah}x)</span>
                <span>{item.total.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          <hr style={{ border: '1px dashed #000' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>TOTAL</span>
            <span>Rp {totalPendapatan.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </main>

      {/* MODAL KONFIRMASI LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-black text-slate-800">Keluar Sesi?</h3>
            <p className="text-slate-400 text-xs mt-2 mb-8">Data transaksi tersimpan aman.</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => signOut(auth)} className="w-full py-4 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Ya, Keluar</button>
              <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
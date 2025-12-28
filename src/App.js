import React, { useState, useEffect } from 'react'; 
import { auth } from './firebase/config'; 
import { onAuthStateChanged } from "firebase/auth";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard'; // Dashboard mengontrol tampilan Home, Stats, dll.

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterPage, setIsRegisterPage] = useState(false);

  useEffect(() => {
    // Memantau status login
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 1. Loading Screen (Sama seperti sebelumnya)
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-[#2d5a4c] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🛒</div>
        </div>
        <div className="text-center">
          <h2 className="text-lg font-black text-slate-800 tracking-tighter uppercase">
            FEB <span className="text-[#ecb12a]">MART</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 animate-pulse">
            Menyiapkan Sistem...
          </p>
        </div>
      </div>
    );
  }

  // 2. Jika BELUM Login: Arahkan ke Login atau Register
  if (!user) {
    return isRegisterPage ? (
      <Register onSwitch={() => setIsRegisterPage(false)} />
    ) : (
      <Login onSwitch={() => setIsRegisterPage(true)} />
    );
  }

  // 3. Jika SUDAH Login: Arahkan ke Dashboard
  // Dashboard secara otomatis akan menampilkan Home.js (Beranda) sebagai tab pertama
  return <Dashboard user={user} />;
}

export default App;
import React, { useState, useEffect } from 'react'; 
import { auth } from './firebase/config'; 
import { onAuthStateChanged } from "firebase/auth";

import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterPage, setIsRegisterPage] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Loading Screen Tech Style
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-indigo-400">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black tracking-[0.3em] uppercase animate-pulse">Synchronizing System...</p>
      </div>
    );
  }

  // Jika BELUM LOGIN
  if (!user) {
    return isRegisterPage ? (
      <Register onSwitch={() => setIsRegisterPage(false)} />
    ) : (
      <Login onSwitch={() => setIsRegisterPage(true)} />
    );
  }

  // Jika SUDAH LOGIN, arahkan ke Dashboard
  return <Dashboard user={user} />;
}

export default App;
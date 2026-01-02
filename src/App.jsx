import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Import Hooks ---
import useDarkMode from './hooks/useDarkMode';

// --- Import Icons & Animation ---
import { FaStore } from 'react-icons/fa'; 
import { motion, AnimatePresence } from 'framer-motion';

// --- Import Komponen Utama ---
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';

// --- Import Pages ---
// Sesuai gambar: folder 'products' dan 'settings'
import ProductsPage from './pages/products/ProductsPage'; 
import ReportsPage from './pages/ReportsPage';
import TransactionsPage from './pages/TransactionsPage';

// Update: Folder settings memiliki SettingsPage.jsx sebagai entry point utama
import SettingsPage from './pages/settings/SettingsPage'; 

function App() {
  const [darkMode, setDarkMode] = useDarkMode(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  // Memantau Status Auth Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Loading splash screen minimal 1 detik agar transisi smooth
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, []);

  // Reset state cropping jika pindah halaman
  useEffect(() => {
    setIsCropping(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await signOut(auth);
        // Pertahankan email di local storage untuk auto-fill login berikutnya jika perlu
        const savedEmail = localStorage.getItem("warung_email");
        localStorage.clear(); 
        if (savedEmail) localStorage.setItem("warung_email", savedEmail);
        
        navigate('/login', { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  // Logika tampilan UI
  const authPaths = ['/login', '/register', '/reset-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  const shouldHideUI = !user || isAuthPage || isCropping;

  // --- SPLASH SCREEN LOADING ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] bg-emerald-500 flex items-center justify-center text-white">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <FaStore className="text-3xl absolute" />
          </div>
          <div className="text-center">
            <p className="font-black uppercase tracking-[0.3em] text-xs">Warung Digital</p>
            <p className="text-[10px] opacity-70 mt-1 uppercase">Menyiapkan Data...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-[#020617]' : 'bg-[#f8fafc]'}`}>
      <div className="flex flex-col md:flex-row min-h-screen relative">
        
        {/* SIDEBAR NAVIGATION */}
        {!shouldHideUI && (
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            user={user} 
            onLogout={handleLogout}
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`flex-1 w-full transition-all duration-500 ${!shouldHideUI ? 'md:pl-0 pb-24 md:pb-0' : ''}`}> 
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              {/* --- PUBLIC / AUTH ROUTES --- */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* --- PROTECTED ROUTES (Hanya untuk User Login) --- */}
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transaksi" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
              
              {/* Produk - Folder: pages/products/ */}
              <Route 
                path="/produk" 
                element={user ? <ProductsPage setIsCropping={setIsCropping} /> : <Navigate to="/login" />} 
              />
              
              <Route path="/laporan" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
              
              {/* Pengaturan - Folder: pages/settings/ */}
              <Route 
                path="/pengaturan/*" // Menggunakan wildcard agar sub-route settings bekerja
                element={user ? (
                  <SettingsPage 
                    user={user} 
                    onLogout={handleLogout} 
                    darkMode={darkMode} 
                    setDarkMode={setDarkMode} 
                    setIsCropping={setIsCropping} 
                  />
                ) : <Navigate to="/login" />} 
              />

              {/* DEFAULT REDIRECTS */}
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} /> 
            </Routes>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}

export default App;
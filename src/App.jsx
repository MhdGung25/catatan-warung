import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// --- Hooks & UI ---
import { motion, AnimatePresence } from 'framer-motion';
import { FaStore } from 'react-icons/fa';
import { 
  FiHome, FiBox, FiActivity, FiShoppingCart, FiSettings 
} from 'react-icons/fi';

// --- Komponen & Pages ---
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard'; // Sesuaikan jika namanya DashboardPage
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';

import ProductsPage from './pages/products/ProductsPage'; 
import ReportsPage from './pages/ReportsPage';
import CashierPage from './pages/CashierPage'; // Pastikan nama file sesuai
import SettingsPage from './pages/settings/SettingsPage'; 

const menuItems = [
  { id: 'dashboard', label: 'Beranda', icon: <FiHome />, path: '/dashboard' },
  { id: 'produk', label: 'Produk', icon: <FiBox />, path: '/produk' },
  { id: 'transaksi', label: 'Kasir', icon: <FiShoppingCart />, path: '/transaksi' },
  { id: 'laporan', label: 'Laporan', icon: <FiActivity />, path: '/laporan' },
  { id: 'settings', label: 'Setelan', icon: <FiSettings />, path: '/settings' },
];

function App() {
  // --- STATE TEMA ---
  const [darkMode, setDarkMode] = useState(false);
  
  // --- STATE AUTH & UI ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Logic Inisialisasi Tema
  useEffect(() => {
    const applyInitialTheme = () => {
      const savedTheme = localStorage.getItem("themeSetting") || "system";
      const root = window.document.documentElement;
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      let isDark = false;
      if (savedTheme === "system") {
        isDark = mediaQuery.matches;
      } else {
        isDark = savedTheme === "dark";
      }
      
      root.classList.toggle("dark", isDark);
      setDarkMode(isDark);
    };

    applyInitialTheme();
    
    // Sinkronisasi tema antar tab
    window.addEventListener('storage', applyInitialTheme);
    return () => window.removeEventListener('storage', applyInitialTheme);
  }, []);

  // 2. Logic Auth Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Memberikan sedikit buffer waktu untuk loading screen yang mulus
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Keluar dari Warung Digital?")) {
      try {
        await signOut(auth);
        navigate('/login');
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    }
  };

  // Logic untuk menyembunyikan Sidebar di halaman Login/Auth atau saat Crop Foto
  const shouldHideUI = !user || ['/login', '/register', '/reset-password'].includes(location.pathname) || isCropping;

  // --- LOADING SCREEN ---
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center text-white z-[999]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <FaStore className="text-3xl text-white animate-pulse" />
          </div>
          <h1 className="text-xs font-black tracking-[0.3em] uppercase text-emerald-500">Warung Digital</h1>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0a0f1e]' : 'bg-[#fcfcfc]'} transition-colors duration-500`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* SIDEBAR NAVIGATION */}
        {!shouldHideUI && (
          <Sidebar 
            menuItems={menuItems} 
            user={user} 
            onLogout={handleLogout} 
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`flex-1 w-full overflow-x-hidden ${!shouldHideUI ? 'pb-20 md:pb-0' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Routes location={location}>
                {/* Public / Auth Routes */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes (Hanya untuk user yang login) */}
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/produk" element={user ? <ProductsPage setIsCropping={setIsCropping} /> : <Navigate to="/login" />} />
                
                {/* Note: Path '/transaksi' di menuItems diarahkan ke CashierPage */}
                <Route path="/transaksi" element={user ? <CashierPage /> : <Navigate to="/login" />} />
                
                <Route path="/laporan" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
                
                <Route path="/settings/*" element={
                  user ? (
                    <SettingsPage 
                      user={user} 
                      onLogout={handleLogout} 
                      darkMode={darkMode} 
                      setDarkMode={setDarkMode} 
                      setIsCropping={setIsCropping} 
                    />
                  ) : <Navigate to="/login" />
                } />

                {/* Default Redirect */}
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
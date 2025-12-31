import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// Import Icons
import { FaStore } from 'react-icons/fa'; // Logo untuk loading screen
import { motion } from 'framer-motion';

// Import komponen & Pages
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import Settings from './pages/Settings';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  // 1. Sinkronisasi Login Firebase & Simulasi Loading Terpusat
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Memberikan jeda simulasi loading agar transisi lebih smooth saat refresh
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sinkronisasi Dark Mode ke HTML Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 3. Reset UI saat pindah halaman
  useEffect(() => {
    setIsCropping(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const savedEmail = localStorage.getItem("warung_email");
      localStorage.clear();
      if (savedEmail) localStorage.setItem("warung_email", savedEmail);
      
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Logika pengecekan halaman Auth
  const authPaths = ['/login', '/register', '/reset-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  
  // Sidebar/Navbar sembunyi jika: belum login, di page auth, atau sedang crop gambar
  const shouldHideUI = !user || isAuthPage || isCropping;

  // --- LOADING SCREEN GLOBAL ---
  // Muncul saat aplikasi pertama kali dimuat atau di-refresh di halaman mana pun
  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] bg-emerald-500 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative flex items-center justify-center"
        >
          {/* Spinner Putih */}
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          
          {/* Logo FaStore di Tengah */}
          <FaStore className="text-white text-3xl absolute z-10" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-[#0f172a]' : 'bg-gray-50'} min-h-screen transition-colors duration-300 font-sans`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* SIDEBAR / BOTTOM NAVBAR */}
        {!shouldHideUI && (
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            user={user} 
          />
        )}

        {/* AREA KONTEN UTAMA */}
        <main className={`flex-1 w-full transition-all duration-300 ${!shouldHideUI ? 'md:pb-0 pb-20' : ''}`}> 
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route 
              path="/login" 
              element={!user ? (
                <Login onSwitch={() => navigate('/register')} />
              ) : (
                <Navigate to="/dashboard" />
              )} 
            />
            
            <Route 
              path="/register" 
              element={!user ? (
                <Register onSwitch={() => navigate('/login')} />
              ) : (
                <Navigate to="/dashboard" />
              )} 
            />

            <Route path="/reset-password" element={<ResetPassword />} />

            {/* PROTECTED ROUTES */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/transaksi" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
            
            <Route 
              path="/produk" 
              element={user ? <ProductsPage setIsCropping={setIsCropping} /> : <Navigate to="/login" />} 
            />
            
            <Route path="/laporan" element={user ? <ReportsPage /> : <Navigate to="/login" />} />
            
            <Route 
              path="/pengaturan" 
              element={user ? (
                <Settings 
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
        </main>
      </div>
    </div>
  );
}

export default App;
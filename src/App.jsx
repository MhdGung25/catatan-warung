import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

// Import Hooks
import useDarkMode from './hooks/useDarkMode';

// Import Icons
import { FaStore } from 'react-icons/fa'; 
import { motion, AnimatePresence } from 'framer-motion';

// Import Komponen
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

// Import Pages (Sesuai update struktur folder di gambar Anda)
import ProductsPage from './pages/products/ProductsPage'; // Update path ke folder products
import ReportsPage from './pages/ReportsPage';
import Settings from './pages/Settings';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  const [darkMode, setDarkMode] = useDarkMode(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false); 

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    });
    return () => unsubscribe();
  }, []);

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

  const authPaths = ['/login', '/register', '/reset-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  const shouldHideUI = !user || isAuthPage || isCropping;

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
          <p className="font-black uppercase tracking-widest text-[10px]">Warung Digital</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#020617]' : 'bg-gray-50'}`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {!shouldHideUI && (
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            user={user} 
          />
        )}

        <main className={`flex-1 w-full transition-all duration-300 ${!shouldHideUI ? 'md:pb-0 pb-20' : ''}`}> 
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* AUTH ROUTES */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* PROTECTED ROUTES */}
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/transaksi" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
              
              {/* Halaman Produk dengan Path Baru */}
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
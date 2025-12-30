import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';

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

  // 1. Sinkronisasi Login Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sinkronisasi Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 3. Reset UI saat pindah halaman (PENTING agar Navbar muncul lagi)
  useEffect(() => {
    setIsCropping(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const authPaths = ['/login', '/register', '/reset-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  
  // LOGIKA UTAMA: Navbar hilang jika tidak login, di page auth, atau modal aktif (isCropping)
  const shouldHideUI = !user || isAuthPage || isCropping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-600">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark bg-[#0f172a]' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        
        {/* SIDEBAR / BOTTOM NAVBAR */}
        {!shouldHideUI && (
          <Sidebar 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            user={user} 
          />
        )}

        {/* AREA KONTEN */}
        <main className={`flex-1 w-full ${!shouldHideUI ? 'md:pb-0 pb-20' : ''}`}> 
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
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

            {/* REDIRECTS */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// Import dari folder components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';

// Import dari folder pages
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import Settings from './pages/Settings';
import TransactionsPage from './pages/TransactionsPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Pantau status login user (Firebase)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fungsi untuk pindah halaman dari Register ke Login atau sebaliknya
  const handleSwitchAuth = (path) => {
    navigate(path);
  };

  const authPaths = ['/', '/login', '/register'];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="flex">
        
        {/* SIDEBAR: Hanya muncul jika user sudah login DAN bukan di halaman auth */}
        {!isAuthPage && user && (
          <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />
        )}

        <main className={`flex-1 ${isAuthPage ? 'w-full' : 'p-6'}`}> 
          <Routes>
            {/* Halaman Auth */}
            <Route path="/" element={<Login onSwitch={() => handleSwitchAuth('/register')} />} />
            <Route path="/login" element={<Login onSwitch={() => handleSwitchAuth('/register')} />} />
            <Route path="/register" element={<Register onSwitch={() => handleSwitchAuth('/login')} />} />
            
            {/* Halaman Aplikasi (Hanya bisa diakses jika user ada) */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route path="/produk" element={<ProductsPage />} />
            <Route path="/laporan" element={<ReportsPage />} />
            <Route path="/transaksi" element={<TransactionsPage />} />
            
            {/* Route Pengaturan */}
            <Route 
              path="/pengaturan" 
              element={<Settings user={user} darkMode={darkMode} setDarkMode={setDarkMode} />} 
            />
            <Route path="/settings" element={<Navigate to="/pengaturan" />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
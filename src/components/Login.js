import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from "firebase/auth";

function Login({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Protokol Gagal: Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      // Mengatur persistensi login (Ingat Saya)
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      // Eksekusi Login
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (err) {
      // Menangani Eror Spesifik dari Firebase
      console.error("Login Error Code:", err.code);
      
      switch (err.code) {
        case 'auth/invalid-email':
          alert("Gagal: Format email yang Anda masukkan tidak valid.");
          break;
        case 'auth/user-not-found':
          alert("Gagal: Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
          break;
        case 'auth/wrong-password':
          alert("Gagal: Kata sandi yang Anda masukkan salah.");
          break;
        case 'auth/invalid-credential':
          alert("Gagal: Email atau kata sandi tidak sesuai.");
          break;
        case 'auth/too-many-requests':
          alert("Sistem Terkunci: Terlalu banyak percobaan gagal. Coba lagi nanti.");
          break;
        case 'auth/user-disabled':
          alert("Akses Ditolak: Akun ini telah dinonaktifkan.");
          break;
        default:
          alert("Sistem Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased overflow-hidden">
      
      {/* SISI KIRI: BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
           <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-[90%] bg-[#2d5a4c] rounded-r-[100px] shadow-2xl z-0"></div>

        <div className="relative z-10 text-center text-white px-12">
          <div className="mb-8">
             <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/20 transition-transform hover:rotate-6 duration-500">
                <span className="text-6xl">🛒</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter text-white">
                FEB <span className="text-[#ecb12a]">MART</span>
             </h1>
             <div className="h-1 w-20 bg-[#ecb12a] mx-auto mt-4 rounded-full"></div>
             <p className="text-emerald-50/80 mt-6 text-lg font-medium italic">
               "Solusi Belanja Kebutuhan Harian Anda"
             </p>
          </div>
          
          <div className="mt-12 opacity-90 grayscale-[0.2]">
            <svg className="w-48 h-48 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
               <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="white"/>
               <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="white"/>
               <line x1="8" y1="6" x2="16" y2="6" stroke="#ecb12a" strokeWidth="2"/>
               <line x1="8" y1="10" x2="16" y2="10" stroke="white"/>
               <line x1="8" y1="14" x2="16" y2="14" stroke="white"/>
            </svg>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM LOGIN */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <div className="h-1.5 w-12 bg-[#ecb12a] mb-4 mx-auto lg:mx-0 rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-widest">Login</h2>
            <p className="text-slate-500 mt-2 font-medium">Silakan masuk menggunakan akun terdaftar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Username / Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2d5a4c] transition-colors">👤</span>
                <input 
                  type="email" 
                  placeholder="Masukkan email Anda" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2d5a4c] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2d5a4c] transition-colors">🔑</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan kata sandi" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2d5a4c] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2d5a4c] transition-colors"
                >
                  {showPassword ? "🔒" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center text-sm cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#ecb12a] border-[#ecb12a]' : 'border-slate-200 bg-white'}`}>
                  {rememberMe && <span className="text-[10px] text-white font-bold">✓</span>}
                </div>
                <span className="ml-2 font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Ingat Saya</span>
              </label>
              <button type="button" className="text-sm font-bold text-[#ecb12a] hover:text-[#d9a021] transition-colors">Lupa Password?</button>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-yellow-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 ${
                loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-[#ecb12a] hover:bg-[#f3bc3a] text-white"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "MASUK"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 font-medium">Belum punya akun?</p>
            <button 
              onClick={onSwitch}
              className="mt-2 text-[#2d5a4c] font-black hover:underline transition-all uppercase text-sm tracking-widest"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
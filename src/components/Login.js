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
    
    // Validasi Dasar
    if (!email || !password) {
      alert("Protokol Ditolak: Kredensial tidak lengkap!");
      return;
    }

    setLoading(true);
    try {
      // 1. Atur Persistence (Sesuai pilihan Remember Me)
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      // 2. Eksekusi Login
      await signInWithEmailAndPassword(auth, email, password);
      
      // INFO: Kamu tidak perlu memanggil fungsi navigasi manual di sini.
      // Jika di App.js sudah ada onAuthStateChanged, Dashboard akan otomatis muncul.
      console.log("Login Berhasil: Mengalihkan ke Dashboard...");
      
    } catch (err) {
      // GAGAL: Tetap di halaman login dan tampilkan pesan error
      console.error("Login Error Code:", err.code);
      
      let errorMessage = "Kegagalan Sistem: Terjadi kesalahan tidak dikenal.";
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = "Akses Ditolak: Email atau Password tidak terdaftar dalam database.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Keamanan: Terlalu banyak percobaan. Akun dibekukan sementara.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Koneksi Terputus: Periksa jaringan satelit Anda.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4 font-sans antialiased text-slate-200">
      
      {/* Background Decor - Cyber Ambient */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-sm group">
        <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-emerald-500/10">
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-2xl shadow-emerald-500/30 mb-5 relative overflow-hidden group-hover:rotate-6 transition-transform duration-500">
              <span className="text-4xl z-10">🏪</span>
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-slate-500 tracking-tighter">
              User Login
            </h2>
            <p className="text-[10px] text-emerald-400 mt-2 uppercase tracking-[0.3em] font-black opacity-70">
              Secure Terminal Access
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-2 tracking-widest">User Identification</label>
              <input 
                type="email" 
                placeholder="id_user@network.com" 
                className="w-full p-4 bg-slate-950/60 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-slate-200 placeholder:text-slate-700 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-2 tracking-widest">Security Token</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full p-4 bg-slate-950/60 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-slate-200 placeholder:text-slate-700 font-mono text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-600 hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            <div className="flex items-center px-2">
              <label className="flex items-center text-[11px] cursor-pointer select-none group/check text-slate-500 hover:text-emerald-400 transition-colors">
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-emerald-600 border-emerald-600' : 'border-slate-700 bg-slate-950'}`}>
                  {rememberMe && <span className="text-[10px] text-white">✓</span>}
                </div>
                <span className="ml-2 font-bold uppercase tracking-tighter">Persistent Session</span>
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black tracking-widest uppercase shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 overflow-hidden group/btn ${
                loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/40 text-white"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Execute Login <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>
          </form>

          <footer className="mt-10 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">System: No account detected?</p>
            <button 
              type="button"
              onClick={onSwitch}
              className="mt-2 text-emerald-400 font-black hover:text-white transition-all uppercase text-xs tracking-widest py-2 px-4 rounded-lg hover:bg-emerald-500/10"
            >
              Initialize Registration
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;
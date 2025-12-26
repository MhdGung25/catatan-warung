import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (!email || !password) {
      alert("Protokol Gagal: Email dan Password wajib diisi!");
      return;
    }
    if (password.length < 6) {
      alert("Keamanan Lemah: Password minimal 6 karakter!");
      return;
    }

    setLoading(true);
    try {
      // Eksekusi pendaftaran ke Firebase
      await createUserWithEmailAndPassword(auth, email, password);
      
      alert("Akses Diterima! Akun berhasil didaftarkan.");
      
      // OTOMATIS pindah ke halaman login melalui props onSwitch
      onSwitch(); 
    } catch (err) {
      // Jika Gagal, tetap di halaman ini dan beri info
      console.error(err.code);
      if (err.code === 'auth/email-already-in-use') {
        alert("Gagal: Email sudah terdaftar dalam database!");
      } else if (err.code === 'auth/invalid-email') {
        alert("Gagal: Format email tidak valid!");
      } else if (err.code === 'auth/weak-password') {
        alert("Gagal: Password terlalu mudah ditebak!");
      } else {
        alert("Sistem Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] p-4 font-sans antialiased text-slate-200">
      
      {/* Background Decor - Visual Teknologi */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-sm group">
        {/* Main Card dengan efek Glassmorphism */}
        <div className="bg-slate-900/40 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-slate-800 transition-all duration-500 hover:border-indigo-500/40 hover:shadow-indigo-500/10">
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-2xl shadow-indigo-500/40 mb-5 relative overflow-hidden group-hover:scale-110 transition-transform duration-500">
              <span className="text-4xl z-10">🚀</span>
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-500 tracking-tighter">
              New Interface
            </h2>
            <p className="text-[10px] text-indigo-400 mt-2 uppercase tracking-[0.3em] font-black opacity-70">
              Authorized Personnel Only
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-2 tracking-widest">Digital Identity</label>
              <input 
                type="email" 
                placeholder="user@network.io" 
                className="w-full p-4 bg-slate-950/60 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 text-slate-200 placeholder:text-slate-700 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-500 ml-2 tracking-widest">Enigma Code</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full p-4 bg-slate-950/60 border border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 text-slate-200 placeholder:text-slate-700 font-mono text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-600 hover:text-indigo-400 transition-colors focus:outline-none"
                >
                  {showPassword ? "🔓" : "🔒"}
                </button>
              </div>
            </div>

            {/* Submit Button dengan Animasi Loading */}
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black tracking-widest uppercase shadow-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 overflow-hidden group/btn ${
                loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-500/40 text-white"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Registry <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>
          </form>

          <footer className="mt-10 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">
              Existing Data Found?
            </p>
            <button 
              type="button"
              onClick={onSwitch}
              className="mt-2 text-indigo-400 font-black hover:text-white transition-all uppercase text-xs tracking-widest py-2 px-4 rounded-lg hover:bg-indigo-500/10"
            >
              Run Login Sequence
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Register;
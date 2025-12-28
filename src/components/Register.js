import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

function Register({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 1. Validasi awal
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
      // 2. Buat akun baru
      // Secara default, Firebase akan menganggap user langsung login setelah ini
      await createUserWithEmailAndPassword(auth, email, password);
      
      // 3. PENTING: Segera hapus sesi (Sign Out) 
      // agar state 'user' di App.js kembali menjadi null
      await signOut(auth);
      
      // 4. Beri notifikasi ke user
      alert("Akses Diterima! Akun berhasil didaftarkan. Silakan login.");
      
      // 5. Ubah state di App.js untuk menampilkan halaman Login
      onSwitch(); 
    } catch (err) {
      console.error("Register Error:", err.code);
      // Penanganan pesan kesalahan yang ramah pengguna
      switch (err.code) {
        case 'auth/email-already-in-use':
          alert("Gagal: Email sudah terdaftar dalam database!");
          break;
        case 'auth/invalid-email':
          alert("Gagal: Format email tidak valid!");
          break;
        case 'auth/weak-password':
          alert("Gagal: Kata sandi terlalu lemah!");
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
             <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/20 transition-transform hover:scale-110 duration-500">
                <span className="text-6xl">✨</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter text-white">
                FEB <span className="text-[#ecb12a]">MART</span>
             </h1>
             <div className="h-1 w-20 bg-[#ecb12a] mx-auto mt-4 rounded-full"></div>
             <p className="text-emerald-50/80 mt-6 text-lg font-medium italic italic">
               "Bergabunglah dan nikmati kemudahan belanja"
             </p>
          </div>
          {/* SVG ICON */}
          <div className="mt-12 opacity-80">
            <svg className="w-48 h-48 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
               <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white"/>
               <circle cx="8.5" cy="7" r="4" stroke="white"/>
               <line x1="20" y1="8" x2="20" y2="14" stroke="#ecb12a" strokeWidth="2"/>
               <line x1="23" y1="11" x2="17" y2="11" stroke="#ecb12a" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM REGISTER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <div className="h-1.5 w-12 bg-[#ecb12a] mb-4 mx-auto lg:mx-0 rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-widest">Daftar</h2>
            <p className="text-slate-500 mt-2 font-medium">Buat akun baru untuk mulai belanja</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Alamat Email</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2d5a4c]">✉️</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2d5a4c] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Kata Sandi Baru</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2d5a4c]">🔒</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter" 
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#2d5a4c] focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2d5a4c]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-[#2d5a4c] hover:bg-[#1f3f35] text-white shadow-emerald-900/10"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "DAFTAR SEKARANG"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-400 font-medium">Sudah memiliki akun?</p>
            <button 
              onClick={onSwitch}
              className="mt-2 text-[#ecb12a] font-black hover:underline transition-all uppercase text-sm tracking-widest"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  LogIn, 
  Eye, 
  EyeOff,
  User
} from "lucide-react";

function Register({ onSwitch }) {
  const [displayName, setDisplayName] = useState(''); // State baru untuk Nama
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      // 1. Buat User di Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Simpan Nama User ke Profile Firebase agar muncul di Settings
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // 3. Paksa logout & Pindah ke Login
      await signOut(auth); 
      alert("Akun berhasil dibuat! Silakan masuk dengan email Anda.");
      onSwitch(); 
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah digunakan oleh akun lain.");
      } else {
        setError("Gagal mendaftar. Periksa koneksi atau data Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-50">
        
        <div className="text-left mb-8">
          <h2 className="text-3xl font-black text-slate-800 mb-1">
            Daftar Akun ✨
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Buat akun untuk akses CatatanKu
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* INPUT NAMA LENGKAP (Penting agar halaman Settings tidak kosong) */}
          <div className="flex items-center gap-3 bg-slate-100 px-4 rounded-2xl border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <User className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              className="w-full py-4 bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-400 text-sm" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-100 px-4 rounded-2xl border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Mail className="text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Baru" 
              className="w-full py-4 bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-400 text-sm" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-100 px-4 rounded-2xl border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <Lock className="text-slate-400" size={20} />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password" 
              className="w-full py-4 bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-400 text-sm" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {/* ICON LIHAT PASSWORD */}
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 px-4 rounded-2xl border border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all">
            <ShieldCheck className="text-slate-400" size={20} />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Konfirmasi Password" 
              className="w-full py-4 bg-transparent outline-none font-semibold text-slate-700 placeholder:text-slate-400 text-sm" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full py-4 bg-indigo-600 text-white rounded-[1.2rem] font-black tracking-wide hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><UserPlus size={20}/> DAFTAR SEKARANG</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Sudah punya akun?{" "}
            {/* TOMBOL KE LOGIN: Menggunakan onSwitch */}
            <button 
              onClick={onSwitch} 
              className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              Masuk <LogIn size={14}/>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
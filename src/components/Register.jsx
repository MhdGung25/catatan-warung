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
  User,
  Sparkles
} from "lucide-react"; // CheckCircle2 sudah dihapus dari sini

function Register({ onSwitch }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError("Password minimal harus 6 karakter!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      await updateProfile(userCredential.user, {
        displayName: displayName.trim()
      });

      await signOut(auth); 
      
      alert("Akun berhasil dibuat! Silakan masuk dengan email Anda.");
      onSwitch(); 
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar. Gunakan email lain.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Format email tidak valid.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Fitur pendaftaran email belum aktif di Firebase Console.");
      } else {
        setError("Gagal mendaftar. Periksa koneksi atau data Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans relative overflow-hidden text-slate-800">
      <div className="absolute top-[-5%] left-[-5%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 z-10">
        
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-2">
            Daftar Akun <Sparkles className="text-emerald-500" size={28} />
          </h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
            Gabung bersama Warung Digital
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center gap-3 text-[11px] font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <User className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
            />
          </div>

          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <Mail className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email Aktif" 
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <Lock className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Password (Min. 6 Karakter)" 
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-emerald-500 transition-colors">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white transition-all">
            <ShieldCheck className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Ulangi Password" 
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            disabled={loading} 
            className={`w-full py-4 rounded-2xl font-black text-white tracking-widest transition-all shadow-lg mt-2 flex items-center justify-center gap-2 uppercase text-xs
              ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-emerald-200"}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><UserPlus size={18}/> BUAT AKUN</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-800 pt-6">
          <p className="text-slate-400 text-[11px] font-bold">
            SUDAH PUNYA AKUN?{" "}
            <button onClick={onSwitch} className="text-emerald-500 font-black hover:underline uppercase ml-1 inline-flex items-center gap-1">
              Masuk Sekarang <LogIn size={14} />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
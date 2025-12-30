import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { confirmPasswordReset } from "firebase/auth";
import { Lock, ShieldCheck, AlertCircle, CheckCircle, Sparkles, LogIn, Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const oobCode = searchParams.get('oobCode');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi sandi tidak cocok!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Sandi minimal harus 6 karakter!");
      return;
    }

    if (!oobCode) {
      setError("Link tidak valid atau sudah kadaluarsa.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
    } catch (err) {
      setError("Gagal memperbarui sandi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-emerald-50 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Berhasil!</h2>
          <p className="text-slate-500 text-xs md:text-sm mb-8 font-medium leading-relaxed">
            Sandi Anda telah diperbarui. Silakan login kembali untuk masuk ke dashboard.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200"
          >
            MASUK SEKARANG <LogIn size={18}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-[380px] md:max-w-md bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 z-10 border border-slate-100 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-50 rounded-2xl mb-4">
            <Sparkles className="text-emerald-500" size={28} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Atur Ulang Sandi</h2>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Warung Digital System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 rounded-r-xl flex items-center gap-3 text-[11px] font-bold animate-in slide-in-from-left-2 duration-300">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          {/* Input Password Baru */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            </div>
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Sandi Baru" 
              className="w-full pl-11 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 text-sm focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-500"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Input Konfirmasi */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ShieldCheck className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            </div>
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="Konfirmasi Sandi" 
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-slate-700 text-sm focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black tracking-widest transition-all shadow-lg text-xs uppercase mt-2
              ${loading 
                ? "bg-slate-300 cursor-wait text-slate-500" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-emerald-100"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>MEMPROSES...</span>
              </div>
            ) : "PERBARUI SANDI"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
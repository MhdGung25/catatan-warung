import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { LuStore } from "react-icons/lu";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiUserPlus,
  FiCheckCircle,
} from "react-icons/fi";

export default function Login({ onSwitch }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const savedEmail = localStorage.getItem("warung_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Ketik email Anda untuk menerima link reset.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg("Link reset terkirim ke email Anda!");
    } catch (err) {
      setError("Gagal mengirim email reset. Pastikan email terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Jika login Google berhasil, buat data default jika belum ada
        if (!localStorage.getItem("shop_name")) {
          localStorage.setItem("shop_name", `Warung ${result.user.displayName}`);
          localStorage.setItem("kasir_name", result.user.displayName);
        }
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Gagal masuk dengan Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (res.user) {
        if (rememberMe) {
          localStorage.setItem("warung_email", email);
        } else {
          localStorage.removeItem("warung_email");
        }
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Email atau sandi salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans relative overflow-hidden">
      {/* Glow Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-500/20">
            <LuStore size={35} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Warung <span className="text-emerald-500">Digital</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Sistem Kasir Pintar
          </p>
        </div>

        {/* FEEDBACK */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-[11px] font-bold border border-red-100 dark:border-red-500/20 animate-in fade-in slide-in-from-top-1">
            <FiAlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl mb-6 text-[11px] font-bold border border-emerald-100 dark:border-emerald-500/20">
            <FiCheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] tracking-widest mb-6 transition-all active:scale-95 border-2 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-800 hover:border-emerald-500/50"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
          ) : (
            <><FcGoogle size={20} /> MASUK DENGAN GOOGLE</>
          )}
        </button>

        <div className="flex items-center gap-4 mb-6 text-slate-300 dark:text-slate-700">
          <div className="flex-1 h-px bg-current" />
          <span className="text-[9px] font-black tracking-widest">ATAU EMAIL</span>
          <div className="flex-1 h-px bg-current" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 transition-all">
            <FiMail className="text-slate-400 group-focus-within:text-emerald-500" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          <div className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 transition-all">
            <FiLock className="text-slate-400 group-focus-within:text-emerald-500" size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-emerald-500">
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 cursor-pointer uppercase tracking-wider">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              Ingat saya
            </label>
            <button type="button" onClick={handleForgotPassword} className="text-[10px] font-black text-emerald-500 uppercase hover:underline">
              Lupa Sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white tracking-[0.2em] transition-all shadow-xl mt-2 text-[10px]
              ${loading ? "bg-slate-400" : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-emerald-500/20"}`}
          >
            {loading ? "MENGOTENTIKASI..." : "MASUK KE DASHBOARD"}
          </button>
        </form>

        {/* TOMBOL DAFTAR (Pemicu onSwitch) */}
        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-800 pt-6">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Belum punya akun?{" "}
            <button 
              type="button" 
              onClick={() => {
                console.log("Tombol daftar diklik"); // Cek di console
                onSwitch(); 
              }} 
              className="text-emerald-500 font-black hover:underline ml-1 inline-flex items-center gap-1"
            >
              DAFTAR SEKARANG <FiUserPlus size={14} />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
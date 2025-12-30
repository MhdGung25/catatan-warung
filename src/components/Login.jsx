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

const googleProvider = new GoogleAuthProvider();

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

  /* ================= EFÈK INGAT EMAIL ================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("warung_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ================= LOGIKA RESET SANDI (KE GMAIL) ================= */
  const handleForgotPassword = async () => {
    // Validasi: Input email tidak boleh kosong
    if (!email) {
      setError("Ketik alamat email Anda di atas untuk mereset sandi.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Mengirim link reset sandi ke email yang terdaftar di Firebase
      await sendPasswordResetEmail(auth, email.trim());
      
      setSuccessMsg("Link reset sandi telah dikirim! Silakan periksa kotak masuk atau spam di Gmail Anda.");
      
      // Memberi instruksi tambahan kepada user
      setTimeout(() => {
        alert("Instruksi: Buka Gmail Anda, klik link dari Firebase, lalu buat sandi baru. Setelah itu silakan login kembali di sini.");
      }, 500);

    } catch (err) {
      console.error(err.code);
      if (err.code === "auth/user-not-found") {
        setError("Email ini belum terdaftar di sistem kami.");
      } else if (err.code === "auth/invalid-email") {
        setError("Format penulisan email salah.");
      } else {
        setError("Terlalu banyak permintaan. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Gagal masuk dengan Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ================= EMAIL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccessMsg("");

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
      setError("Email atau sandi salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans relative overflow-hidden">
      {/* Animasi Background */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 z-10 transition-all duration-300">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <LuStore size={40} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">
            Warung <span className="text-emerald-500">Digital</span>
          </h1>
          <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Sistem Kasir Pintar
          </p>
        </div>

        {/* NOTIFIKASI */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-6 text-[11px] font-bold border border-red-100 dark:border-red-500/20 animate-bounce">
            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-2xl mb-6 text-[11px] font-bold border border-emerald-100 dark:border-emerald-500/20">
            <FiCheckCircle size={16} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN GOOGLE */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs mb-6 transition-all active:scale-95 border-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-700 hover:border-emerald-200"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin"></div>
          ) : (
            <><FcGoogle size={22} /> MASUK DENGAN GOOGLE</>
          )}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 tracking-widest">ATAU</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* FORM UTAMA */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Input Email */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
            <FiMail className="text-slate-400" size={18} />
            <input
              type="email"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm"
              required
            />
          </div>

          {/* Input Password */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 rounded-2xl border-2 border-transparent focus-within:border-emerald-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
            <FiLock className="text-slate-400" size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 dark:text-white text-sm"
              required={!loading}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-emerald-500"
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Navigasi Kecil */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 cursor-pointer uppercase">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ingat saya
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-[10px] font-black text-emerald-500 uppercase hover:underline"
            >
              Lupa Sandi?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white tracking-widest transition-all shadow-lg mt-2 text-xs
              ${loading ? "bg-slate-400 cursor-wait" : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-emerald-200/50"}`}
          >
            {loading ? "PROSES..." : "MASUK KE APLIKASI"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-slate-50 dark:border-slate-800 pt-6">
          <p className="text-slate-400 text-[11px] font-bold">
            BELUM PUNYA AKUN?{" "}
            <button 
              type="button"
              onClick={onSwitch} 
              className="text-emerald-500 font-black hover:underline uppercase ml-1"
            >
              Daftar Sekarang <FiUserPlus className="inline ml-1" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
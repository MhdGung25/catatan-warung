import React, { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"; // Menghapus signInWithRedirect yang tidak terpakai
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

  /* ================= REMEMBER EMAIL ================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("warung_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError("");

    try {
      // Menggunakan Popup (Pastikan Authorized Domains di Firebase sudah ada localhost)
      const result = await signInWithPopup(auth, googleProvider);
      
      if (result.user) {
        // Navigasi ditaruh di dalam sini agar hanya jalan jika login sukses
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Firebase Error Code:", err.code);
      if (err.code === "auth/operation-not-allowed") {
        setError("Login Google belum diaktifkan di Firebase Console.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Jendela login ditutup sebelum selesai.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Proses login sedang berjalan di jendela lain.");
      } else {
        setError("Gagal masuk dengan Google. Coba lagi.");
      }
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

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (res.user) {
        if (rememberMe) {
          localStorage.setItem("warung_email", email);
        } else {
          localStorage.removeItem("warung_email");
        }
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Email atau password salah.");
      } else {
        setError("Terjadi kesalahan teknis. Cek koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-50 animate-in fade-in zoom-in duration-500">

        {/* LOGO / BRAND */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <LuStore size={44} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Warung Digital
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Kelola usaha lebih mudah & aman
          </p>
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 text-red-600 px-4 py-4 rounded-2xl mb-6 text-xs font-bold border border-red-100 animate-pulse">
            <FiAlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {/* GOOGLE LOGIN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm mb-6 transition-all active:scale-95 border-2
            ${
              googleLoading
                ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
                : "bg-white text-slate-700 border-slate-100 hover:border-indigo-200 hover:bg-slate-50 shadow-sm"
            }`}
        >
          <FcGoogle className="text-2xl" />
          {googleLoading ? "MEMPROSES..." : "MASUK DENGAN GOOGLE"}
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-black text-slate-300 tracking-[0.2em]">ATAU EMAIL</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* FORM LOGIN */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 px-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
            <FiMail className="text-slate-400 text-lg" />
            <input
              type="email"
              placeholder="email@warung.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 rounded-2xl border-2 border-transparent focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
            <FiLock className="text-slate-400 text-lg" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-4 bg-transparent outline-none font-bold text-slate-700 placeholder:text-slate-300 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between px-1 pt-1">
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 cursor-pointer uppercase tracking-tighter">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ingat saya
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-white tracking-widest transition-all shadow-lg mt-2
              ${
                loading
                  ? "bg-slate-400 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200"
              }`}
          >
            {loading ? "MENCOCOKKAN DATA..." : "MASUK KE WARUNG"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
          <p className="text-slate-400 text-sm font-medium">
            Belum punya akun?{" "}
            <button 
              type="button"
              onClick={onSwitch} 
              className="text-indigo-600 font-extrabold hover:underline inline-flex items-center gap-1"
            >
              Daftar Sekarang <FiUserPlus />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiCheck, FiEdit2, FiX, FiSave, 
  FiLock, FiTrash2, FiShield, FiAlertTriangle 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Settings({ user, onLogout, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  
  // --- STATE DATA ---
  const savedName = localStorage.getItem("warung_user_name") || user?.displayName || "Agung";
  const savedImage = localStorage.getItem("warung_profile_image") || null;

  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  
  // State Baru untuk Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // State Form Password
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  
  const [tempName, setTempName] = useState(savedName);
  const [tempImage, setTempImage] = useState(savedImage);
  const [hasChanges, setHasChanges] = useState(false);

  // --- LOGIKA PROFIL ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    localStorage.setItem("warung_user_name", tempName);
    localStorage.setItem("warung_profile_image", tempImage || "");
    window.dispatchEvent(new Event("storage")); 
    setHasChanges(false);
    setIsEditingName(false);
    alert("Profil berhasil diperbarui!");
  };

  // --- LOGIKA GANTI PASSWORD ---
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.new || !passwords.confirm) {
      alert("Semua kolom wajib diisi!");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    // Simulasi simpan (bisa hubungkan ke Firebase/Backend di sini)
    alert("Password berhasil diperbarui!");
    setShowPasswordModal(false);
    setPasswords({ new: "", confirm: "" });
  };

  // --- LOGIKA RESET DATA ---
  const handleFinalReset = () => {
    localStorage.clear(); // Menghapus semua cache & session
    alert("Semua data telah dibersihkan. Aplikasi akan dimuat ulang.");
    window.location.href = "/login";
  };

 // --- LOGIKA LOGOUT (FIXED) ---
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Jalankan fungsi logout (hapus session/token)
      if (onLogout) {
        await onLogout();
      } else {
        // Jika tidak ada props onLogout, hapus manual session-nya
        localStorage.removeItem("warung_user_session"); 
        // hapus data lain jika perlu
      }
      
      // 2. Arahkan ke halaman Login
      // Gunakan replace: true agar user tidak bisa tekan tombol 'back' untuk masuk lagi
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 500);

    } catch (error) {
      console.error("Logout Error:", error);
      alert("Gagal logout. Silakan coba lagi.");
      setIsLoggingOut(false);
    }
  };
  const userInitial = tempName.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 pb-40">
      <div className="max-w-md mx-auto p-4 pt-24 md:pt-12 space-y-6">
        
        {/* SECTION 1: PROFIL CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1e293b] p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 text-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500 rounded-t-full" />
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden">
              {tempImage ? <img src={tempImage} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-4xl font-black">{userInitial}</span>}
            </div>
            <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-3 rounded-full border-4 border-white dark:border-[#1e293b] cursor-pointer hover:scale-110 transition-transform shadow-lg">
              <FiCamera size={18} />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[80px]">
            {isEditingName ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border-2 border-emerald-500/50">
                <input autoFocus className="bg-transparent text-center font-black text-slate-800 dark:text-white uppercase outline-none w-40" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                <button onClick={() => setIsEditingName(false)} className="text-emerald-500"><FiCheck size={20}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{tempName}</h3>
                <button onClick={() => setIsEditingName(true)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl"><FiEdit2 size={14} /></button>
              </div>
            )}
            <p className="text-slate-400 text-[10px] font-black mt-3 tracking-widest uppercase">{user?.email || "ADMIN@WARUNG.COM"}</p>
          </div>

          <AnimatePresence>
            {hasChanges && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mt-6">
                <button onClick={handleSaveChanges} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-500/20"><FiSave size={14} /> Simpan Perubahan</button>
                <button onClick={() => { setTempName(savedName); setTempImage(savedImage); setHasChanges(false); }} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-2xl active:scale-95"><FiX size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* SECTION 2: SISTEM */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 px-2 mb-2">
            <FiShield className="text-emerald-500" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Keamanan & Sistem</h4>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px]">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
              </div>
              <p className="font-black text-slate-800 dark:text-white text-sm">Mode Gelap</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 flex items-center rounded-full px-1 transition-all ${darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}>
              <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Button Ganti Password */}
          <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px] text-slate-800 dark:text-white active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-2xl"><FiLock size={20} /></div>
              <p className="font-black text-sm">Ganti Kata Sandi</p>
            </div>
            <FiEdit2 size={14} className="text-slate-400" />
          </button>

          {/* Button Reset Cache */}
          <button onClick={() => setShowResetModal(true)} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px] text-slate-800 dark:text-white active:scale-95 transition-all">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-2xl"><FiTrash2 size={20} /></div>
            <p className="font-black text-sm">Bersihkan Cache Data</p>
          </button>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="pt-2">
          {!showConfirmLogout ? (
            <motion.button onClick={() => setShowConfirmLogout(true)} className="w-full p-5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-[28px] font-black uppercase text-[11px] flex items-center justify-center gap-3 active:scale-95 shadow-sm transition-all">
              <FiLogOut size={18} /> Keluar Aplikasi
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 p-6 bg-red-50 dark:bg-red-500/10 rounded-[32px] border border-red-100 dark:border-red-500/20 text-center">
              <p className="text-[11px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Yakin ingin keluar?</p>
              <div className="flex gap-3">
                <button onClick={handleLogoutConfirm} disabled={isLoggingOut} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95">{isLoggingOut ? "..." : "Ya, Logout"}</button>
                <button onClick={() => setShowConfirmLogout(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase border border-slate-200 dark:border-slate-700">Batal</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* --- MODAL GANTI PASSWORD --- */}
        <AnimatePresence>
          {showPasswordModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-[#1e293b] w-full max-w-xs p-6 rounded-[32px] shadow-2xl">
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2"><FiLock className="text-blue-500"/> Ganti Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase ml-2">Password Baru</p>
                    <input required type="password" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all dark:text-white" placeholder="••••••••" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase ml-2">Konfirmasi</p>
                    <input required type="password" className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 transition-all dark:text-white" placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase active:scale-95">Update</button>
                    <button type="button" onClick={() => setShowPasswordModal(false)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Batal</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- MODAL RESET DATA (CACHE) --- */}
        <AnimatePresence>
          {showResetModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-red-900/20 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white dark:bg-[#1e293b] w-full max-w-xs p-8 rounded-[40px] shadow-2xl text-center border-b-8 border-red-500">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiAlertTriangle size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase">Hapus Semua?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Tindakan ini akan menghapus semua data transaksi, pengaturan, dan sesi Anda secara permanen.</p>
                <div className="flex flex-col gap-3">
                  <button onClick={handleFinalReset} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-500/30 active:scale-95 transition-all">Ya, Bersihkan Semua</button>
                  <button onClick={() => setShowResetModal(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase">Batalkan</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center space-y-1 opacity-50">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">v2.0.4 • Warung Digital Cloud</p>
          <p className="text-[8px] text-slate-400 uppercase">Licensed to {tempName}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
import React, { useState, useEffect, useCallback } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiCheck, FiEdit2, FiX, FiSave, 
  FiLock, FiTrash2, FiShield, FiAlertTriangle,
  FiTrash
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

function Settings({ user, onLogout, darkMode, setDarkMode, setIsCropping }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // --- STATE DATA ---
  const savedName = localStorage.getItem("warung_user_name") || user?.displayName || "Admin";
  const savedImage = localStorage.getItem("warung_profile_image") || null;

  const [tempName, setTempName] = useState(savedName);
  const [tempImage, setTempImage] = useState(savedImage);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  // --- STATE PASSWORD ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- STATE MODAL ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  // --- STATE CROPPER ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // --- 1. RESET SCROLL KE ATAS ---
  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, [pathname]);

  // --- 2. SINKRONISASI CROPPER ---
  useEffect(() => {
    setIsCropping(!!imageToCrop);
  }, [imageToCrop, setIsCropping]);

  // --- LOGIKA IMAGE CROP ---
  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageToCrop;
      await new Promise((resolve) => (image.onload = resolve));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 400;
      ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0, 400, 400
      );
      setTempImage(canvas.toDataURL("image/jpeg", 0.8));
      setHasChanges(true);
      setImageToCrop(null); 
    } catch (e) {
      console.error("Gagal memotong gambar:", e);
    }
  };

  // --- ACTION HANDLERS ---
  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) return alert("Wajib isi semua kolom!");
    if (newPassword.length < 6) return alert("Minimal 6 karakter!");
    if (newPassword !== confirmPassword) return alert("Password tidak cocok!");

    localStorage.setItem("warung_admin_pass", newPassword);
    alert("Password sukses diubah! Silakan login kembali.");
    handleLogoutAction();
  };

  const handleSaveChanges = () => {
    localStorage.setItem("warung_user_name", tempName);
    localStorage.setItem("warung_profile_image", tempImage || "");
    window.dispatchEvent(new Event("storage")); 
    setHasChanges(false);
    setIsEditingName(false);
    alert("Profil diperbarui!");
  };

  const handleFinalReset = () => {
    localStorage.clear();
    alert("Data berhasil dibersihkan.");
    window.location.href = "/";
  };

  const handleLogoutAction = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("warung_user_session");
    navigate("/login", { replace: true });
  };

  const userInitial = tempName.substring(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300 pb-32 font-sans">
      <div className="max-w-md mx-auto p-4 pt-24 md:pt-32 space-y-6">
        
        {/* PROFIL CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1e293b] p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden">
              {tempImage ? <img src={tempImage} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-5xl font-black">{userInitial}</span>}
            </div>
            <label className="absolute bottom-0 right-0 bg-emerald-500 text-white p-3 rounded-full border-4 border-white dark:border-[#1e293b] cursor-pointer hover:scale-110 transition-transform">
              <FiCamera size={20} /><input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            {tempImage && (
              <button onClick={() => { setTempImage(null); setHasChanges(true); }} className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full border-4 border-white dark:border-[#1e293b] hover:scale-110 transition-transform">
                <FiTrash size={14} />
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border-2 border-emerald-500/50">
                <input autoFocus className="bg-transparent text-center font-black text-slate-800 dark:text-white uppercase outline-none w-full" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                <button onClick={() => setIsEditingName(false)} className="text-emerald-500"><FiCheck size={20}/></button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{tempName}</h3>
                <button onClick={() => setIsEditingName(true)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-emerald-500 transition-colors"><FiEdit2 size={14} /></button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {hasChanges && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mt-8">
                <button onClick={handleSaveChanges} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 active:scale-95"><FiSave size={14} /> Simpan</button>
                <button onClick={() => { setTempName(savedName); setTempImage(savedImage); setHasChanges(false); }} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-2xl active:scale-95"><FiX size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MENU SETTINGS */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 px-2 mb-2"><FiShield className="text-emerald-500" /><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem & Keamanan</h4></div>

          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px]">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>{darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}</div>
              <p className="font-black text-slate-800 dark:text-white text-sm">Mode Gelap</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 flex items-center rounded-full px-1 transition-all ${darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}>
              <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-md" />
            </button>
          </div>

          <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px] text-slate-800 dark:text-white active:scale-95">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-2xl"><FiLock size={20} /></div>
              <p className="font-black text-sm">Ubah Password</p>
            </div>
            <FiEdit2 size={14} className="text-slate-400" />
          </button>

          <button onClick={() => setShowResetModal(true)} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[28px] text-slate-800 dark:text-white active:scale-95">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-2xl"><FiTrash2 size={20} /></div>
            <p className="font-black text-sm">Hapus Data Transaksi</p>
          </button>
        </div>

        {/* LOGOUT */}
        <div className="pt-2">
          {!showConfirmLogout ? (
            <button onClick={() => setShowConfirmLogout(true)} className="w-full p-5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-[28px] font-black uppercase text-[11px] flex items-center justify-center gap-3 active:scale-95"><FiLogOut size={18} /> Keluar Aplikasi</button>
          ) : (
            <div className="space-y-4 p-6 bg-red-50 dark:bg-red-500/10 rounded-[32px] border border-red-100 dark:border-red-500/20 text-center">
              <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">Yakin ingin keluar?</p>
              <div className="flex gap-3">
                <button onClick={handleLogoutAction} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95">Ya, Logout</button>
                <button onClick={() => setShowConfirmLogout(false)} className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase border border-slate-200">Batal</button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL PASSWORD */}
        <AnimatePresence>
          {showPasswordModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-[#1e293b] w-full max-w-xs p-8 rounded-[40px] shadow-2xl">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiLock size={24} /></div>
                <h3 className="text-lg font-black dark:text-white mb-4 text-center uppercase tracking-tight">Ubah Password</h3>
                <div className="space-y-3">
                  <input type="password" placeholder="Password Baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl outline-none text-sm dark:text-white border-2 border-transparent focus:border-blue-500" />
                  <input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl outline-none text-sm dark:text-white border-2 border-transparent focus:border-blue-500" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleUpdatePassword} className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95">Update</button>
                    <button onClick={() => { setShowPasswordModal(false); setNewPassword(""); setConfirmPassword(""); }} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase active:scale-95">Batal</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL RESET DATA */}
        <AnimatePresence>
          {showResetModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white dark:bg-[#1e293b] w-full max-w-xs p-8 rounded-[40px] shadow-2xl text-center border-b-8 border-red-500">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiAlertTriangle size={32} /></div>
                <h3 className="text-lg font-black dark:text-white uppercase mb-2">Hapus Data?</h3>
                <p className="text-[11px] text-slate-500 mb-6">Semua riwayat transaksi akan hilang permanen.</p>
                <button onClick={handleFinalReset} className="w-full bg-red-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg mb-2">Bersihkan Data</button>
                <button onClick={() => setShowResetModal(false)} className="w-full py-2 text-slate-400 font-black text-[10px] uppercase">Batalkan</button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL CROP FOTO */}
        <AnimatePresence>
          {imageToCrop && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4">
              <div className="relative w-full h-[60vh] md:h-[70vh] rounded-3xl overflow-hidden border border-white/10">
                <Cropper
                  image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false}
                  onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}
                />
              </div>
              <div className="w-full max-w-xs mt-8 space-y-6">
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-500" />
                <div className="flex gap-4">
                  <button onClick={createCroppedImage} className="flex-1 bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase">Terapkan</button>
                  <button onClick={() => setImageToCrop(null)} className="flex-1 bg-white/10 text-white py-5 rounded-[2rem] font-black text-xs uppercase">Batal</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center opacity-40">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Warung POS v2.0.4</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
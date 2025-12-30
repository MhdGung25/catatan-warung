import React, { useState, useEffect, useCallback } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiCheck, FiEdit2, FiX, FiSave, 
  FiTrash2, FiTrash, FiMail, FiEye, FiLock
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

function Settings({ user, onLogout, darkMode, setDarkMode, setIsCropping }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // --- DATA USER ---
  const displayEmail = user?.email || localStorage.getItem("warung_user_email") || "guest@warung.com";
  const savedName = localStorage.getItem("warung_user_name") || user?.displayName || "Admin Warung";
  const savedImage = localStorage.getItem("warung_profile_image") || user?.photoURL || null;

  const [tempName, setTempName] = useState(savedName);
  const [tempImage, setTempImage] = useState(savedImage);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // --- STATE PASSWORD ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- STATE MODAL ---
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  // --- STATE CROPPER ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { setIsCropping(!!imageToCrop); }, [imageToCrop, setIsCropping]);

  const onCropComplete = useCallback((_, pixels) => { setCroppedAreaPixels(pixels); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
    setShowFullImage(false);
  };

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageToCrop;
      await new Promise((resolve) => (image.onload = resolve));
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 500;
      canvas.height = 500;
      ctx.drawImage(
        image,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0, 500, 500
      );
      setTempImage(canvas.toDataURL("image/jpeg", 0.9));
      setHasChanges(true);
      setImageToCrop(null); 
    } catch (e) { console.error(e); }
  };

  const handleSaveChanges = () => {
    localStorage.setItem("warung_user_name", tempName);
    localStorage.setItem("warung_profile_image", tempImage || "");
    window.dispatchEvent(new Event("storage")); 
    setHasChanges(false);
    setIsEditingName(false);
    alert("Profil disimpan!");
  };

  const handleClearHistory = () => {
    const p = prompt("Ketik 'HAPUS' untuk menghapus semua transaksi:");
    if(p === 'HAPUS') {
      localStorage.removeItem("warung_transactions");
      alert("Riwayat dihapus.");
      window.location.reload();
    }
  };

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) {
      return alert("Password tidak boleh kosong!");
    }
    if (newPassword !== confirmPassword) {
      return alert("Password tidak cocok!");
    }

    const yakin = window.confirm("Yakin ingin mengubah password?");
    if (yakin) {
      localStorage.setItem("warung_admin_pass", newPassword);
      alert("Password berhasil diperbarui! Gunakan password ini untuk login berikutnya.");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordModal(false);
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("warung_user_session");
    navigate("/login", { replace: true });
  };

  const userInitial = tempName.substring(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 pb-40 font-sans">
      <div className="max-w-md mx-auto p-4 pt-24 space-y-6">
        
        {/* PROFIL CARD */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          
          <div className="relative w-32 h-32 mx-auto mb-6">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => tempImage ? setShowFullImage(true) : document.getElementById('upload-photo').click()}
              className="w-full h-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-700 shadow-2xl overflow-hidden cursor-pointer group"
            >
              {tempImage ? (
                <>
                  <img src={tempImage} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <FiEye size={24} />
                  </div>
                </>
              ) : (
                <span className="text-5xl font-black">{userInitial}</span>
              )}
            </motion.div>
            
            <label htmlFor="upload-photo" className="absolute bottom-0 right-0 bg-emerald-500 text-white p-3 rounded-full border-4 border-white dark:border-[#0f172a] cursor-pointer hover:scale-110 transition-transform shadow-lg z-10">
              <FiCamera size={18} />
              <input id="upload-photo" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          
          <div className="space-y-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-2xl border-2 border-emerald-500/30">
                <input autoFocus className="bg-transparent text-center font-black text-slate-800 dark:text-white uppercase outline-none w-full" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                <button onClick={() => setIsEditingName(false)} className="text-emerald-500"><FiCheck size={20}/></button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 group">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{tempName}</h3>
                <button onClick={() => setIsEditingName(true)} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"><FiEdit2 size={14} /></button>
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
              <FiMail size={12} />
              <p className="text-[11px] font-bold uppercase tracking-widest">{displayEmail}</p>
            </div>
          </div>

          <AnimatePresence>
            {hasChanges && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex gap-2 mt-8">
                <button onClick={handleSaveChanges} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95"><FiSave size={14} /> Simpan Perubahan</button>
                <button onClick={() => { setTempName(savedName); setTempImage(savedImage); setHasChanges(false); }} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 py-4 rounded-2xl active:scale-95"><FiX size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MENU */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-3">
          
          {/* MODE GELAP */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem]">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>{darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}</div>
              <p className="font-black text-slate-800 dark:text-white text-sm">Mode Gelap</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`w-14 h-8 flex items-center rounded-full px-1 transition-all ${darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}>
              <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-lg" />
            </button>
          </div>

          {/* UBAH PASSWORD */}
          <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] text-slate-800 dark:text-white active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-2xl"><FiLock size={20} /></div>
              <p className="font-black text-sm">Ubah Password</p>
            </div>
            <FiEdit2 size={14} className="text-slate-300" />
          </button>

          {/* HAPUS RIWAYAT */}
          <button onClick={handleClearHistory} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-[2rem] text-slate-800 dark:text-white active:scale-95 transition-all hover:bg-red-500/5 group">
            <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-colors"><FiTrash2 size={20} /></div>
            <p className="font-black text-sm">Hapus Data Transaksi</p>
          </button>
        </div>

        {/* LOGOUT */}
        <button onClick={() => setShowConfirmLogout(true)} className="w-full p-6 bg-red-500/5 text-red-500 rounded-[2.5rem] font-black uppercase text-[11px] flex items-center justify-center gap-3 active:scale-95 border border-red-500/10 transition-all hover:bg-red-500/10">
          <FiLogOut size={18} /> Keluar Aplikasi
        </button>

        {/* MODAL PASSWORD */}
        <AnimatePresence>
          {showPasswordModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-[#0f172a] w-full max-w-xs p-8 rounded-[3rem] shadow-2xl border border-white/10">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><FiLock size={28} /></div>
                <h3 className="text-lg font-black dark:text-white mb-6 text-center uppercase tracking-tight">Update Password</h3>
                <div className="space-y-3">
                  <input type="password" placeholder="Password Baru" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl outline-none text-sm dark:text-white border-2 border-transparent focus:border-blue-500 transition-all" />
                  <input type="password" placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900 p-5 rounded-2xl outline-none text-sm dark:text-white border-2 border-transparent focus:border-blue-500 transition-all" />
                  <div className="flex flex-col gap-2 pt-4">
                    <button onClick={handleUpdatePassword} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl active:scale-95">Update Sekarang</button>
                    <button onClick={() => { setShowPasswordModal(false); setNewPassword(""); setConfirmPassword(""); }} className="w-full py-3 text-slate-400 font-black text-[10px] uppercase">Batal</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL LIHAT PROFIL */}
        <AnimatePresence>
          {showFullImage && tempImage && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md"
            >
              <button onClick={() => setShowFullImage(false)} className="absolute top-8 right-8 text-white/50 hover:text-white p-2"><FiX size={32} /></button>
              <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
                <img src={tempImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="mt-10 flex gap-6">
                 <button onClick={() => document.getElementById('upload-photo').click()} className="flex flex-col items-center gap-2 text-white/70 hover:text-emerald-500 transition-colors">
                    <div className="p-4 bg-white/10 rounded-full"><FiEdit2 size={24} /></div>
                    <span className="text-[10px] font-bold uppercase">Ubah</span>
                 </button>
                 <button onClick={() => { setTempImage(null); setHasChanges(true); setShowFullImage(false); }} className="flex flex-col items-center gap-2 text-white/70 hover:text-red-500 transition-colors">
                    <div className="p-4 bg-white/10 rounded-full"><FiTrash size={24} /></div>
                    <span className="text-[10px] font-bold uppercase">Hapus</span>
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL CROPPER */}
        <AnimatePresence>
          {imageToCrop && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-4">
              <div className="relative w-full h-[60vh] rounded-[3rem] overflow-hidden">
                <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
              </div>
              <div className="w-full max-w-xs mt-10 space-y-6">
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-500 appearance-none" />
                <div className="flex gap-4">
                  <button onClick={createCroppedImage} className="flex-1 bg-emerald-500 text-white py-5 rounded-3xl font-black text-xs uppercase active:scale-95">Terapkan</button>
                  <button onClick={() => setImageToCrop(null)} className="flex-1 bg-white/5 text-white py-5 rounded-3xl font-black text-xs uppercase">Batal</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL LOGOUT */}
        <AnimatePresence>
          {showConfirmLogout && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] text-center shadow-2xl w-full max-w-xs border border-white/10">
                <FiLogOut size={48} className="mx-auto text-red-500 mb-4" />
                <h4 className="text-slate-800 dark:text-white font-black mb-6 uppercase">Selesai Berjualan?</h4>
                <div className="flex gap-3">
                  <button onClick={handleLogoutAction} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase active:scale-95">Ya, Keluar</button>
                  <button onClick={() => setShowConfirmLogout(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-white rounded-2xl font-black text-[10px] uppercase">Batal</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center opacity-30 pb-10 uppercase tracking-[0.4em] text-[9px] font-black text-slate-400">Warung POS Premium v2.0.4</div>
      </div>
    </div>
  );
}

export default Settings;
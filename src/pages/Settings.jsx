import React, { useState, useEffect, useCallback } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiEdit2, FiX, FiSave, 
  FiTrash2, FiTrash, FiMail, FiLock 
} from "react-icons/fi"; // Dihapus: FiCheck, FiEye, FiSettings (tidak dipakai)
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

function Settings({ user, onLogout, darkMode, setDarkMode, setIsCropping }) {
  const navigate = useNavigate(); // Sekarang digunakan di handleLogoutAction
  const { pathname } = useLocation();
  
  // --- DATA USER ---
  const displayEmail = user?.email || localStorage.getItem("warung_user_email") || "guest@warung.com";
  const savedName = localStorage.getItem("warung_user_name") || user?.displayName || "Admin Warung";
  const savedImage = localStorage.getItem("warung_profile_image") || user?.photoURL || null;

  const [tempName, setTempName] = useState(savedName);
  const [tempImage, setTempImage] = useState(savedImage);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  // --- STATE CROPPER ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // --- SYNC NAVBAR & MODALS ---
  useEffect(() => {
    const isAnyModalOpen = showPasswordModal || showConfirmLogout || !!imageToCrop;
    if (setIsCropping) setIsCropping(isAnyModalOpen);
    return () => { if (setIsCropping) setIsCropping(false); };
  }, [showPasswordModal, showConfirmLogout, imageToCrop, setIsCropping]);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  const onCropComplete = useCallback((_, pixels) => { setCroppedAreaPixels(pixels); }, []);

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
    alert("Profil berhasil diperbarui!");
  };

  const handleLogoutAction = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("warung_user_session");
    navigate("/login", { replace: true }); // Penggunaan 'navigate' di sini
  };

  const userInitial = tempName.substring(0, 1).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300 pb-20 pt-24 md:pt-32 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white tracking-tight">Pengaturan</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola profil dan keamanan akun kasir Anda.</p>
          </div>
          <span className="px-4 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 w-fit">
            V2.0.4 Premium Suite
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KIRI: PROFIL */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 bg-white dark:bg-[#0f172a] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 group">
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center rounded-full border-4 border-white dark:border-slate-900 shadow-md overflow-hidden">
                {tempImage ? (
                  <img src={tempImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold">{userInitial}</span>
                )}
              </div>
              <label htmlFor="upload-photo" className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2.5 rounded-full border-4 border-white dark:border-[#0f172a] cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <FiCamera size={18} />
                <input id="upload-photo" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="w-full text-center space-y-3">
              {isEditingName ? (
                <div className="flex flex-col gap-2">
                  <input autoFocus className="bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-xl border-2 border-emerald-500 text-center font-bold text-slate-800 dark:text-white outline-none w-full" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                  <button onClick={() => setIsEditingName(false)} className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Selesai Edit</button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate">{tempName}</h3>
                  <button onClick={() => setIsEditingName(true)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                    <FiEdit2 size={16} />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 py-1.5 px-4 rounded-full w-fit mx-auto">
                <FiMail size={12} />
                <p className="text-[10px] font-bold tracking-wider uppercase">{displayEmail}</p>
              </div>
            </div>

            {hasChanges && (
              <div className="flex w-full gap-2 mt-8">
                <button onClick={handleSaveChanges} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                  <FiSave className="inline mr-2" size={14} /> Simpan
                </button>
                <button onClick={() => { setTempName(savedName); setTempImage(savedImage); setHasChanges(false); }} className="px-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-colors">
                  <FiX size={18} />
                </button>
              </div>
            )}
          </motion.div>

          {/* KANAN: MENU */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Preferensi Keamanan</h4>

              <div className="grid grid-cols-1 gap-3">
                {/* MODE GELAP */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-transparent dark:border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                      {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm">Tema Visual</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{darkMode ? 'Gelap' : 'Terang'}</p>
                    </div>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} className={`w-11 h-6 flex items-center rounded-full px-1 transition-all ${darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}>
                    <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>

                {/* PASSWORD */}
                <button onClick={() => setShowPasswordModal(true)} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-blue-500/20 group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all"><FiLock size={20} /></div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">Kata Sandi</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Update akses admin</p>
                    </div>
                  </div>
                  <FiEdit2 size={14} className="text-slate-300" />
                </button>

                {/* DELETE HISTORY */}
                <button onClick={() => {
                   const p = prompt("Ketik 'HAPUS' untuk menghapus semua transaksi:");
                   if(p === 'HAPUS') {
                     localStorage.removeItem("warung_transactions");
                     alert("Data dibersihkan.");
                     window.location.reload();
                   }
                }} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/20 group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all"><FiTrash2 size={20} /></div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 dark:text-white text-sm">Database</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Kosongkan riwayat kasir</p>
                    </div>
                  </div>
                  <FiTrash size={14} className="text-slate-300" />
                </button>
              </div>

              <button onClick={() => setShowConfirmLogout(true)} className="w-full mt-8 p-4 bg-white dark:bg-[#0f172a] text-red-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border-2 border-slate-100 dark:border-slate-800 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95">
                <FiLogOut size={16} /> Keluar Sesi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PASSWORD */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-[#0f172a] w-full max-w-sm p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><FiLock size={28} /></div>
              <h3 className="text-xl font-bold dark:text-white mb-6">Ubah Akses Admin</h3>
              <div className="space-y-3">
                <input type="password" placeholder="PASSWORD BARU" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-sm font-bold dark:text-white border border-slate-200 dark:border-slate-800" />
                <input type="password" placeholder="KONFIRMASI" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-3 rounded-xl outline-none text-sm font-bold dark:text-white border border-slate-200 dark:border-slate-800" />
                <button onClick={() => {
                  if(newPassword && newPassword === confirmPassword) {
                    localStorage.setItem("warung_admin_pass", newPassword);
                    alert("Berhasil!");
                    setShowPasswordModal(false);
                  } else { alert("Data tidak valid"); }
                }} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase mt-4">Update Sekarang</button>
                <button onClick={() => setShowPasswordModal(false)} className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase">Batal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CROPPER */}
      <AnimatePresence>
        {imageToCrop && (
          <div className="fixed inset-0 z-[1002] bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-white/10">
              <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div className="w-full max-w-sm mt-8 space-y-6">
               <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-500 appearance-none cursor-pointer" />
               <div className="flex gap-3">
                <button onClick={createCroppedImage} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-xs uppercase">Terapkan</button>
                <button onClick={() => setImageToCrop(null)} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase">Batal</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL LOGOUT */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#0f172a] p-10 rounded-3xl text-center shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><FiLogOut size={28} /></div>
              <h4 className="text-slate-800 dark:text-white text-xl font-bold mb-2">Akhiri Sesi?</h4>
              <p className="text-xs text-slate-400 font-medium mb-8">Anda akan diarahkan kembali ke halaman login.</p>
              <div className="flex flex-col gap-2">
                <button onClick={handleLogoutAction} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-red-500/20 active:scale-95 transition-all">Ya, Keluar</button>
                <button onClick={() => setShowConfirmLogout(false)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase">Batal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
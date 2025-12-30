import React, { useState, useEffect, useCallback } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiCheck, FiEdit2, FiX, FiSave, 
  FiTrash2, FiTrash, FiMail, FiEye, FiLock, FiSettings
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
    alert("Profil berhasil diperbarui!");
  };

  const handleClearHistory = () => {
    const p = prompt("Ketik 'HAPUS' untuk menghapus semua transaksi:");
    if(p === 'HAPUS') {
      localStorage.removeItem("warung_transactions");
      alert("Seluruh riwayat transaksi telah dibersihkan.");
      window.location.reload();
    }
  };

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) return alert("Password tidak boleh kosong!");
    if (newPassword !== confirmPassword) return alert("Konfirmasi password tidak cocok!");

    if (window.confirm("Yakin ingin mengubah password admin?")) {
      localStorage.setItem("warung_admin_pass", newPassword);
      alert("Password berhasil diperbarui!");
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 pb-32 font-sans pt-24 md:pt-32 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER LAYOUT */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight">Pengaturan</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Personalisasi akun dan keamanan sistem Anda.</p>
          </div>
          <div className="hidden md:block">
             <span className="px-5 py-2 bg-indigo-500/10 text-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-500/20">
               Versi 2.0.4 Premium
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SISI KIRI: PROFIL CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-5 bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-indigo-500" />
            
            <div className="relative w-32 h-32 md:w-44 md:h-44 mx-auto mb-8">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                onClick={() => tempImage ? setShowFullImage(true) : document.getElementById('upload-photo').click()}
                className="w-full h-full bg-slate-100 dark:bg-slate-800 text-emerald-500 flex items-center justify-center rounded-full border-8 border-white dark:border-slate-900 shadow-2xl overflow-hidden cursor-pointer group transition-all"
              >
                {tempImage ? (
                  <>
                    <img src={tempImage} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <FiEye size={32} />
                    </div>
                  </>
                ) : (
                  <span className="text-5xl md:text-7xl font-black">{userInitial}</span>
                )}
              </motion.div>
              
              <label htmlFor="upload-photo" className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-emerald-500 text-white p-4 rounded-2xl border-4 border-white dark:border-[#0f172a] cursor-pointer hover:scale-110 transition-transform shadow-xl z-10">
                <FiCamera size={20} />
                <input id="upload-photo" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            
            <div className="space-y-4">
              {isEditingName ? (
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-[1.5rem] border-2 border-emerald-500/30">
                  <input autoFocus className="bg-transparent text-center font-black text-slate-800 dark:text-white uppercase outline-none w-full text-lg" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                  <button onClick={() => setIsEditingName(false)} className="text-emerald-500 p-2"><FiCheck size={24}/></button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 group">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{tempName}</h3>
                  <button onClick={() => setIsEditingName(true)} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors md:opacity-0 group-hover:opacity-100"><FiEdit2 size={18} /></button>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                <FiMail size={14} />
                <p className="text-xs font-bold uppercase tracking-widest">{displayEmail}</p>
              </div>
            </div>

            <AnimatePresence>
              {hasChanges && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 mt-10">
                  <button onClick={handleSaveChanges} className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black text-[11px] uppercase flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"><FiSave size={16} /> Simpan Profil</button>
                  <button onClick={() => { setTempName(savedName); setTempImage(savedImage); setHasChanges(false); }} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 py-5 rounded-2xl active:scale-95 transition-all"><FiX size={18} /></button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SISI KANAN: MENU PENGATURAN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-6 md:p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
              
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4">Preferensi Sistem</h4>

              {/* MODE GELAP */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 md:p-6 rounded-[2rem] border border-transparent dark:border-slate-800/50">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl shadow-sm ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                    {darkMode ? <FiMoon size={24} /> : <FiSun size={24} />}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 dark:text-white text-sm md:text-base">Tampilan Mode Gelap</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{darkMode ? 'Aktif' : 'Non-Aktif'}</p>
                  </div>
                </div>
                <button onClick={() => setDarkMode(!darkMode)} className={`w-16 h-9 flex items-center rounded-full px-1.5 transition-all duration-300 ${darkMode ? "bg-emerald-500 justify-end" : "bg-slate-300 justify-start"}`}>
                  <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-lg" />
                </button>
              </div>

              {/* UBAH PASSWORD */}
              <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 md:p-6 rounded-[2rem] text-slate-800 dark:text-white active:scale-[0.98] transition-all hover:border-blue-500/30 border border-transparent">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-2xl shadow-sm"><FiLock size={24} /></div>
                  <div className="text-left">
                    <p className="font-black text-sm md:text-base">Keamanan & Password</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Update kunci akses admin</p>
                  </div>
                </div>
                <FiEdit2 size={16} className="text-slate-300" />
              </button>

              {/* HAPUS RIWAYAT */}
              <button onClick={handleClearHistory} className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 md:p-6 rounded-[2rem] text-slate-800 dark:text-white active:scale-[0.98] transition-all hover:bg-red-500/5 group border border-transparent">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm"><FiTrash2 size={24} /></div>
                  <div className="text-left">
                    <p className="font-black text-sm md:text-base">Bersihkan Data Transaksi</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Hapus seluruh riwayat penjualan</p>
                  </div>
                </div>
                <FiTrash size={16} className="text-slate-300" />
              </button>
            </div>

            {/* TOMBOL LOGOUT */}
            <button onClick={() => setShowConfirmLogout(true)} className="w-full p-8 bg-white dark:bg-[#0f172a] text-red-500 rounded-[3rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 active:scale-95 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:bg-red-500 hover:text-white">
              <FiLogOut size={22} /> Keluar Dari Sesi Aplikasi
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-20 text-center space-y-2 opacity-40">
           <div className="flex items-center justify-center gap-3 text-slate-400">
             <FiSettings className="animate-spin-slow" />
             <p className="uppercase tracking-[0.5em] text-[10px] font-black">Warung POS Premium Suite</p>
           </div>
           <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Lokal Storage Database • Secure Encryption</p>
        </div>
      </div>

      {/* MODAL PASSWORD */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-[#0f172a] w-full max-w-sm p-10 rounded-[3.5rem] shadow-2xl border border-white/5 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"><FiLock size={32} /></div>
              <h3 className="text-xl font-black dark:text-white mb-2 uppercase tracking-tight">Ganti Password</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-8">Gunakan kombinasi yang aman</p>
              
              <div className="space-y-4">
                <input type="password" placeholder="PASSWORD BARU" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-blue-500 transition-all text-center" />
                <input type="password" placeholder="KONFIRMASI PASSWORD" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl outline-none text-sm font-bold dark:text-white border-2 border-transparent focus:border-blue-500 transition-all text-center" />
                <div className="flex flex-col gap-3 pt-6">
                  <button onClick={handleUpdatePassword} className="w-full bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Update Password</button>
                  <button onClick={() => { setShowPasswordModal(false); setNewPassword(""); setConfirmPassword(""); }} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200">Batal</button>
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
            className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-2xl"
          >
            <button onClick={() => setShowFullImage(false)} className="absolute top-8 right-8 text-white/50 hover:text-white p-4 transition-colors"><FiX size={40} /></button>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
              <img src={tempImage} alt="Preview" className="w-full h-full object-cover" />
            </motion.div>
            <div className="mt-12 flex gap-8">
               <button onClick={() => document.getElementById('upload-photo').click()} className="flex flex-col items-center gap-3 text-white/60 hover:text-emerald-500 transition-all group">
                  <div className="p-5 bg-white/10 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all"><FiEdit2 size={28} /></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ganti Foto</span>
               </button>
               <button onClick={() => { if(window.confirm('Hapus foto profil?')) { setTempImage(null); setHasChanges(true); setShowFullImage(false); } }} className="flex flex-col items-center gap-3 text-white/60 hover:text-red-500 transition-all group">
                  <div className="p-5 bg-white/10 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all"><FiTrash size={28} /></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">Hapus</span>
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CROPPER */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-2xl h-[50vh] md:h-[60vh] rounded-[3rem] overflow-hidden border-2 border-white/5">
              <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div className="w-full max-w-xs mt-12 space-y-8 text-center">
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sesuaikan Ukuran (Zoom)</p>
                 <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg accent-emerald-500 appearance-none cursor-pointer" />
              </div>
              <div className="flex gap-4">
                <button onClick={createCroppedImage} className="flex-1 bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase active:scale-95 shadow-xl shadow-emerald-500/20">Terapkan</button>
                <button onClick={() => setImageToCrop(null)} className="flex-1 bg-white/5 text-white/60 py-5 rounded-[2rem] font-black text-xs uppercase hover:bg-white/10 transition-colors">Batal</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL LOGOUT */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0f172a] p-10 rounded-[3.5rem] text-center shadow-2xl w-full max-w-sm border border-white/5">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner"><FiLogOut size={44} /></div>
              <h4 className="text-slate-800 dark:text-white text-xl font-black mb-3 uppercase tracking-tight">Selesai Berjualan?</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-10 leading-relaxed">Pastikan semua transaksi telah disimpan sebelum Anda keluar.</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleLogoutAction} className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-red-500/20 active:scale-95 transition-all">Ya, Akhiri Sesi</button>
                <button onClick={() => setShowConfirmLogout(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200">Kembali</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Settings;
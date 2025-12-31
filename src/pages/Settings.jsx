import React, { useState, useEffect, useCallback } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiCamera, 
  FiEdit2, FiX, FiSave, 
  FiMail, FiLock,
  FiPhone, FiCreditCard, FiEye, FiEyeOff,
  FiMapPin, FiClock, FiShoppingBag, FiUser,
  FiAlertTriangle, FiRefreshCw, FiCheckCircle
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";

function Settings({ user, onLogout, darkMode, setDarkMode, setIsCropping }) {
  const navigate = useNavigate();

  // --- LOGIKA AUTO-FILL (START) ---
  // Fungsi ini memastikan jika user baru register, data dasar langsung terisi di localStorage
  useEffect(() => {
    const initDefaults = () => {
      const defaults = {
        "warung_user_name": user?.displayName || "Pemilik Warung",
        "shop_name": `${user?.displayName || 'Warung'} Digital`,
        "kasir_name": user?.displayName || "Admin",
        "warung_type": "Toko Kelontong",
        "warung_open": "08:00 - 21:00",
        "low_stock_threshold": "5",
        "enable_qris": "false",
        "auto_print": "true",
        "warung_address": "Alamat belum diatur",
      };

      Object.entries(defaults).forEach(([key, value]) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, value);
        }
      });
      
      // Trigger update state setelah default diatur
      window.dispatchEvent(new Event("storage"));
    };

    initDefaults();
  }, [user]);
  // --- LOGIKA AUTO-FILL (END) ---

  // --- STATES (Mengambil dari LocalStorage yang sudah di-auto-fill) ---
  const [tempName, setTempName] = useState(localStorage.getItem("warung_user_name") || "");
  const [tempImage, setTempImage] = useState(localStorage.getItem("warung_profile_image") || user?.photoURL || null);
  const [tempPhone, setTempPhone] = useState(localStorage.getItem("warung_user_phone") || "");
  const [tempBank, setTempBank] = useState(localStorage.getItem("warung_user_bank") || "");
  
  const [warungName, setWarungName] = useState(localStorage.getItem("shop_name") || "");
  const [warungType, setWarungType] = useState(localStorage.getItem("warung_type") || "");
  const [warungAddress, setWarungAddress] = useState(localStorage.getItem("warung_address") || "");
  const [warungOpen, setWarungOpen] = useState(localStorage.getItem("warung_open") || "");
  const [kasirName, setKasirName] = useState(localStorage.getItem("kasir_name") || "");

  const [enableQRIS, setEnableQRIS] = useState(localStorage.getItem("enable_qris") === "true");
  const [autoPrint, setAutoPrint] = useState(localStorage.getItem("auto_print") === "true");
  const [lowStockThreshold, setLowStockThreshold] = useState(localStorage.getItem("low_stock_threshold") || 5);

  const [isShopOpen, setIsShopOpen] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showBank, setShowBank] = useState(false);

  // --- LOGIKA JAM OPERASIONAL ---
  useEffect(() => {
    const checkOpenStatus = () => {
      try {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [start, end] = warungOpen.split("-").map(t => t.trim());
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;
        setIsShopOpen(currentTime >= startTime && currentTime <= endTime);
      } catch (e) {
        setIsShopOpen(true);
      }
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [warungOpen]);

  // --- CROPPER LOGIC ---
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (setIsCropping) setIsCropping(showPasswordModal || showConfirmLogout || !!imageToCrop || showFullProfile);
  }, [showPasswordModal, showConfirmLogout, imageToCrop, showFullProfile, setIsCropping]);

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

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
    const image = new Image();
    image.src = imageToCrop;
    await new Promise(r => (image.onload = r));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400; canvas.height = 400;
    ctx.drawImage(image, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, 400, 400);
    const base64 = canvas.toDataURL("image/jpeg");
    setTempImage(base64);
    localStorage.setItem("warung_profile_image", base64); // Langsung simpan foto
    setHasChanges(true);
    setImageToCrop(null);
  };

  const handleSaveChanges = () => {
    localStorage.setItem("warung_user_name", tempName);
    localStorage.setItem("warung_profile_image", tempImage || "");
    localStorage.setItem("warung_user_phone", tempPhone);
    localStorage.setItem("warung_user_bank", tempBank);
    localStorage.setItem("shop_name", warungName);
    localStorage.setItem("warung_type", warungType);
    localStorage.setItem("warung_address", warungAddress);
    localStorage.setItem("warung_open", warungOpen);
    localStorage.setItem("kasir_name", kasirName);
    localStorage.setItem("enable_qris", enableQRIS);
    localStorage.setItem("auto_print", autoPrint);
    localStorage.setItem("low_stock_threshold", lowStockThreshold);

    window.dispatchEvent(new Event("storage"));
    setHasChanges(false);
    setIsEditingName(false);
    alert("✅ Konfigurasi Berhasil Disimpan!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-24 pt-24 md:pt-32 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Pengaturan</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isShopOpen ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {isShopOpen ? "● Toko Buka" : "○ Toko Tutup"}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
              <FiRefreshCw className="text-emerald-500 animate-spin" size={12} /> Sinkronisasi Cloud Aktif
            </p>
          </div>
          {hasChanges && (
            <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={handleSaveChanges} className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
              <FiSave size={18} /> Simpan Perubahan
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KARTU PROFIL (KIRI) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] border dark:border-slate-800 flex flex-col items-center shadow-sm">
              <div className="relative mb-6">
                <div onClick={() => tempImage && setShowFullProfile(true)} className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center cursor-pointer group">
                  {tempImage ? (
                    <img src={tempImage} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  ) : (
                    <span className="text-5xl font-black text-emerald-500">{tempName?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label htmlFor="upload-photo" className="absolute bottom-1 right-1 bg-emerald-500 text-white p-3 rounded-full border-4 border-white dark:border-[#0f172a] cursor-pointer hover:scale-110 transition-all shadow-lg">
                  <FiCamera size={18} />
                  <input id="upload-photo" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              
              <div className="w-full text-center space-y-4">
                {isEditingName ? (
                  <div className="relative">
                    <input autoFocus className="bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-xl border-2 border-emerald-500 text-center font-black text-slate-800 dark:text-white outline-none w-full" value={tempName} onChange={(e) => { setTempName(e.target.value); setHasChanges(true); }} />
                    <button onClick={() => setIsEditingName(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"><FiCheckCircle size={20}/></button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-800 dark:text-white">
                    <h3 className="text-xl font-black uppercase tracking-tight">{tempName}</h3>
                    <button onClick={() => setIsEditingName(true)} className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"><FiEdit2 size={16} /></button>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-50 dark:bg-slate-900/50 py-2 px-4 rounded-full border dark:border-slate-800">
                  <FiMail className="text-emerald-500" size={12} />
                  <p className="text-[10px] font-black uppercase tracking-widest">{user?.email || "user@warung.com"}</p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] border dark:border-slate-800 space-y-3 shadow-sm">
              <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="flex items-center gap-3">
                  {darkMode ? <FiMoon className="text-indigo-400" /> : <FiSun className="text-orange-400" />}
                  <span className="text-[10px] font-black uppercase dark:text-slate-300">Mode {darkMode ? 'Gelap' : 'Terang'}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                  <motion.div animate={{ x: darkMode ? 18 : 2 }} className="absolute top-1 w-2 h-2 bg-white rounded-full" />
                </div>
              </button>
              <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800 text-[10px] font-black uppercase dark:text-slate-300 hover:bg-blue-500/5">
                <FiLock className="text-blue-500" /> Ganti Keamanan
              </button>
              <button onClick={() => setShowConfirmLogout(true)} className="w-full flex items-center gap-3 p-4 text-red-500 bg-red-500/5 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all group">
                <FiLogOut /> <span className="text-[10px] font-black uppercase">Akhiri Sesi</span>
              </button>
            </div>
          </div>

          {/* FORM BISNIS (KANAN) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] border dark:border-slate-800 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <FiShoppingBag className="text-emerald-500" /> Profil Bisnis & Operasional
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nama Toko</label>
                  <input value={warungName} onChange={(e) => { setWarungName(e.target.value); setHasChanges(true); }} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Kategori Usaha</label>
                  <input value={warungType} onChange={(e) => { setWarungType(e.target.value); setHasChanges(true); }} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Petugas Kasir Aktif</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={kasirName} onChange={(e) => { setKasirName(e.target.value); setHasChanges(true); }} className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Jam Operasional</label>
                  <div className="relative">
                    <FiClock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isShopOpen ? 'text-emerald-500' : 'text-red-500'}`} />
                    <input placeholder="08:00 - 21:00" value={warungOpen} onChange={(e) => { setWarungOpen(e.target.value); setHasChanges(true); }} className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Lokasi Fisik (Untuk Struk)</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-4 text-slate-400" />
                    <textarea value={warungAddress} onChange={(e) => { setWarungAddress(e.target.value); setHasChanges(true); }} className="w-full p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white border dark:border-slate-800 outline-none focus:border-emerald-500 font-bold text-sm min-h-[100px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* FINANSIAL */}
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] border dark:border-slate-800 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <FiCreditCard className="text-blue-500" /> Finansial & Pembayaran
              </h4>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  <span className="text-sm font-black dark:text-white uppercase tracking-tighter">Aktifkan Metode QRIS</span>
                  <input type="checkbox" className="w-6 h-6 accent-emerald-500" checked={enableQRIS} onChange={(e) => { setEnableQRIS(e.target.checked); setHasChanges(true); }} />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                    <FiPhone className="text-emerald-500" />
                    <input type={showPhone ? "text" : "password"} placeholder="No. WhatsApp" className="bg-transparent flex-1 outline-none font-bold text-sm dark:text-white" value={tempPhone} onChange={(e) => { setTempPhone(e.target.value); setHasChanges(true); }} />
                    <button onClick={() => setShowPhone(!showPhone)} className="text-slate-400">{showPhone ? <FiEyeOff size={18}/> : <FiEye size={18} />}</button>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                    <FiCreditCard className="text-blue-500" />
                    <input type={showBank ? "text" : "password"} placeholder="No. Rekening/Bank" className="bg-transparent flex-1 outline-none font-bold text-sm dark:text-white" value={tempBank} onChange={(e) => { setTempBank(e.target.value); setHasChanges(true); }} />
                    <button onClick={() => setShowBank(!showBank)} className="text-slate-400">{showBank ? <FiEyeOff size={18}/> : <FiEye size={18} />}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* SYSTEM SETTINGS */}
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] border dark:border-slate-800 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FiAlertTriangle className="text-orange-500" /> Konfigurasi Sistem
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <label className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800 cursor-pointer">
                    <span className="text-sm font-black dark:text-white uppercase tracking-tighter">Cetak Struk Otomatis</span>
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={autoPrint} onChange={(e) => { setAutoPrint(e.target.checked); setHasChanges(true); }} />
                 </label>
                 <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                     <span className="text-sm font-black dark:text-white uppercase tracking-tighter">Batas Stok Rendah</span>
                     <span className="text-xs font-black text-orange-500">{lowStockThreshold} Item</span>
                    </div>
                    <input type="range" min="1" max="20" className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" value={lowStockThreshold} onChange={(e) => { setLowStockThreshold(e.target.value); setHasChanges(true); }} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SECTION (CROPPER & CONFIRMS) */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[1105] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#0f172a] p-10 rounded-[3.5rem] w-full max-w-sm shadow-2xl border dark:border-slate-800">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-black dark:text-white uppercase text-xs tracking-widest">Update Keamanan</h4>
                <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-red-500"><FiX size={20}/></button>
              </div>
              <input type="password" placeholder="Password Baru" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 outline-none focus:border-blue-500 font-bold text-sm dark:text-white mb-4" />
              <button onClick={() => setShowPasswordModal(false)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">Ganti Password</button>
            </motion.div>
          </div>
        )}

        {showConfirmLogout && (
          <div className="fixed inset-0 z-[1120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#0f172a] p-12 rounded-[4rem] text-center shadow-2xl w-full max-w-sm border dark:border-slate-800">
              <FiLogOut className="text-red-500 text-5xl mx-auto mb-6" />
              <h4 className="text-slate-800 dark:text-white text-xl font-black uppercase tracking-tighter">Akhiri Sesi?</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-2 tracking-widest">Anda harus login kembali nanti</p>
              <div className="flex flex-col gap-3 mt-10">
                <button onClick={() => { onLogout(); navigate("/login"); }} className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/30 active:scale-95 transition-all">Ya, Logout</button>
                <button onClick={() => setShowConfirmLogout(false)} className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batalkan</button>
              </div>
            </motion.div>
          </div>
        )}

        {imageToCrop && (
          <div className="fixed inset-0 z-[1110] bg-slate-950 flex flex-col items-center justify-center p-6">
            <div className="relative w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/10">
              <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div className="w-full max-w-md mt-10 flex gap-4">
                <button onClick={createCroppedImage} className="flex-1 bg-emerald-500 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20">Gunakan Foto</button>
                <button onClick={() => setImageToCrop(null)} className="flex-1 bg-white/10 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Batal</button>
            </div>
          </div>
        )}

        {showFullProfile && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl" onClick={() => setShowFullProfile(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="relative max-w-2xl w-full aspect-square rounded-[4rem] overflow-hidden border-8 border-white/10 shadow-full">
              <img src={tempImage} alt="Full View" className="w-full h-full object-cover" />
              <button className="absolute top-8 right-8 p-4 bg-black/20 text-white rounded-full"><FiX size={24} /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
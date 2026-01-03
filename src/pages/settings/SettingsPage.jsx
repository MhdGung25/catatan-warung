import React, { useState, useEffect, useRef } from "react";
import { 
  FiMoon, FiSun, FiLogOut, FiLayout, FiMonitor,
  FiUser, FiCheck, FiCreditCard, FiSmartphone, FiHash, FiLoader
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage({ onLogout, setDarkMode }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("general");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | loading | success | error

  // Settings & Profile States
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem("warungLogo") || null);
  const [themeSetting, setThemeSetting] = useState(() => localStorage.getItem("themeSetting") || "system");
  const [cashierLayout, setCashierLayout] = useState(() => localStorage.getItem("cashierLayout") || "grid");
  
  const [profile, setProfile] = useState({
    nama: localStorage.getItem("warungNama") || "",
    whatsapp: localStorage.getItem("warungWA") || "",
    alamat: localStorage.getItem("warungAlamat") || ""
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem("paymentMethods");
    return saved ? JSON.parse(saved) : { Tunai: true, QRIS: false, Transfer: false };
  });

  const [paymentDetails, setPaymentDetails] = useState({
    qrisDetail: localStorage.getItem("qrisDetail") || "",
    transferDetail: localStorage.getItem("transferDetail") || ""
  });

  // --- HANDLERS ---

  const notifyChanges = () => {
    window.dispatchEvent(new Event("storage")); 
    window.dispatchEvent(new CustomEvent("data-updated"));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Ukuran file maksimal 2MB!");
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        localStorage.setItem("warungLogo", reader.result);
        notifyChanges();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setSaveStatus("loading");
    
    // Simulasi delay sedikit agar user merasa sistem sedang bekerja
    setTimeout(() => {
      try {
        if (!profile.nama) throw new Error("Nama wajib diisi");
        
        localStorage.setItem("warungNama", profile.nama);
        localStorage.setItem("warungWA", profile.whatsapp);
        localStorage.setItem("warungAlamat", profile.alamat);
        
        notifyChanges();
        setSaveStatus("success");
        
        // Reset status tombol setelah 2 detik
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    }, 600);
  };

  const handleLayoutChange = (layoutId) => {
    setCashierLayout(layoutId);
    localStorage.setItem("cashierLayout", layoutId);
    notifyChanges();
  };

  const togglePayment = (method) => {
    const newData = { ...paymentMethods, [method]: !paymentMethods[method] };
    if (Object.values(newData).filter(Boolean).length === 0) return alert("Minimal satu metode aktif!");
    setPaymentMethods(newData);
    localStorage.setItem("paymentMethods", JSON.stringify(newData));
    notifyChanges();
  };

  const updateDetail = (key, value) => {
    const newDetails = { ...paymentDetails, [key]: value };
    setPaymentDetails(newDetails);
    localStorage.setItem(key, value);
    notifyChanges();
  };

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      let shouldBeDark = themeSetting === "system" ? mediaQuery.matches : themeSetting === "dark";
      root.classList.toggle("dark", shouldBeDark);
      if(setDarkMode) setDarkMode(shouldBeDark); 
      localStorage.setItem("themeSetting", themeSetting);
    };
    applyTheme();
  }, [themeSetting, setDarkMode]);

  const tabs = [
    { id: "general", label: "Profil Warung", icon: FiUser },
    { id: "payment", label: "Metode Bayar", icon: FiCreditCard },
    { id: "cashier", label: "Layout Kasir", icon: FiLayout },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] pb-32 pt-10 px-4 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter">SET<span className="text-emerald-500">TINGS</span></h1>
          
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border dark:border-slate-800 shadow-sm">
            {[{ id: 'light', icon: FiSun }, { id: 'system', icon: FiMonitor }, { id: 'dark', icon: FiMoon }].map((t) => (
              <button key={t.id} onClick={() => setThemeSetting(t.id)} className={`p-3 rounded-xl transition-all ${themeSetting === t.id ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-500'}`}>
                <t.icon size={18} />
              </button>
            ))}
            <button onClick={() => setShowConfirmLogout(true)} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase ml-2 flex items-center gap-2 hover:bg-rose-600">
              <FiLogOut /> LOGOUT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center justify-between p-5 rounded-2xl font-black text-[10px] uppercase border transition-all ${activeTab === t.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 dark:border-slate-800'}`}>
                <div className="flex items-center gap-3"><t.icon size={18} /> {t.label}</div>
                {activeTab === t.id && <FiCheck size={16} />} 
              </button>
            ))}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border dark:border-slate-800 shadow-sm min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                
                {/* TAB: GENERAL (PROFIL WARUNG) */}
                {activeTab === "general" && (
                  <div className="space-y-8">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    
                    <div className="flex items-center gap-6 pb-6 border-b dark:border-slate-800">
                      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-emerald-500 overflow-hidden group-hover:border-emerald-500 transition-all">
                          {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" alt="Logo" /> : <FiUser size={32} />}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 shadow-lg border dark:border-slate-700 p-2 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                          <FiSmartphone size={14} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase dark:text-white tracking-widest">Logo Warung</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Format JPG, PNG. Maks 2MB</p>
                        <button onClick={() => fileInputRef.current.click()} className="mt-2 text-[10px] text-emerald-500 font-black uppercase hover:underline">Pilih File</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase dark:text-slate-400 tracking-wider">Nama Warung</label>
                        <input 
                          type="text" 
                          value={profile.nama}
                          onChange={(e) => setProfile({...profile, nama: e.target.value})}
                          placeholder="Warung Berkah" 
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 dark:text-white outline-none focus:border-emerald-500 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase dark:text-slate-400 tracking-wider">WhatsApp</label>
                        <input 
                          type="text" 
                          value={profile.whatsapp}
                          onChange={(e) => setProfile({...profile, whatsapp: e.target.value})}
                          placeholder="0812..." 
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 dark:text-white outline-none focus:border-emerald-500 transition-all" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase dark:text-slate-400 tracking-wider">Alamat Lengkap</label>
                        <textarea 
                          rows="3" 
                          value={profile.alamat}
                          onChange={(e) => setProfile({...profile, alamat: e.target.value})}
                          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-800 dark:text-white outline-none focus:border-emerald-500 transition-all resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={saveStatus === "loading"}
                      className={`
                        flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg
                        ${saveStatus === "idle" ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : ""}
                        ${saveStatus === "loading" ? "bg-slate-400 text-white cursor-not-allowed" : ""}
                        ${saveStatus === "success" ? "bg-blue-500 text-white" : ""}
                        ${saveStatus === "error" ? "bg-rose-500 text-white" : ""}
                      `}
                    >
                      {saveStatus === "loading" && <FiLoader className="animate-spin" size={14} />}
                      {saveStatus === "success" && <FiCheck size={14} />}
                      {saveStatus === "idle" && "Simpan Perubahan"}
                      {saveStatus === "loading" && "Menyimpan..."}
                      {saveStatus === "success" && "Berhasil Disimpan!"}
                      {saveStatus === "error" && "Gagal Menyimpan"}
                    </button>
                  </div>
                )}

                {/* TAB: PAYMENT */}
                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.keys(paymentMethods).map((m) => (
                        <div key={m} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center ${paymentMethods[m] ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-100 dark:border-slate-800 opacity-40'}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${paymentMethods[m] ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                            {m === "Tunai" ? <FiCreditCard size={20} /> : m === "QRIS" ? <FiSmartphone size={20} /> : <FiHash size={20} />}
                          </div>
                          <span className="text-[10px] font-black dark:text-white uppercase mb-4">{m}</span>
                          <button onClick={() => togglePayment(m)} className={`w-10 h-5 rounded-full relative transition-all ${paymentMethods[m] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${paymentMethods[m] ? 'left-6' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                      {paymentMethods.QRIS && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase dark:text-slate-400">Detail QRIS</label>
                          <input type="text" value={paymentDetails.qrisDetail} onChange={(e) => updateDetail("qrisDetail", e.target.value)} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 ring-emerald-500" placeholder="e.g. Toko Berkah - 00123" />
                        </div>
                      )}
                      {paymentMethods.Transfer && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase dark:text-slate-400">Detail Bank</label>
                          <input type="text" value={paymentDetails.transferDetail} onChange={(e) => updateDetail("transferDetail", e.target.value)} className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-1 ring-emerald-500" placeholder="e.g. BCA 12345678 a/n Warung" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: CASHIER LAYOUT */}
                {activeTab === "cashier" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: "grid", label: "Grid View", icon: FiLayout, desc: "Item tampil kotak-kotak, cocok untuk layar sentuh besar." },
                      { id: "list", label: "List View", icon: FiHash, desc: "Item tampil berderet ke bawah, lebih detail & ringkas." }
                    ].map(l => (
                      <button key={l.id} onClick={() => handleLayoutChange(l.id)} className={`p-6 rounded-[2.5rem] border-2 text-left transition-all flex flex-col ${cashierLayout === l.id ? 'border-emerald-500 bg-emerald-500/5 ring-4 ring-emerald-500/10' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cashierLayout === l.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}><l.icon size={24} /></div>
                        <h3 className="text-sm font-black uppercase dark:text-white tracking-widest mb-1">{l.label}</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-4 leading-relaxed max-w-[200px]">{l.desc}</p>
                        
                        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl w-full border border-slate-200/50 dark:border-slate-700/50">
                          {l.id === "grid" ? (
                            <div className="grid grid-cols-3 gap-2">
                              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square bg-emerald-500/20 rounded-lg border border-emerald-500/30" />)}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="h-4 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center px-2">
                                  <div className="w-1.5 h-1.5 bg-emerald-500/40 rounded-full" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL LOGOUT */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] text-center w-full max-w-sm border dark:border-slate-800 shadow-2xl">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500"><FiLogOut size={24} /></div>
              <h4 className="text-slate-800 dark:text-white font-black uppercase text-sm">Akhiri Sesi?</h4>
              <div className="flex flex-col gap-2 mt-8">
                <button onClick={() => { onLogout(); navigate("/login"); }} className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase hover:bg-rose-600 transition-colors">Ya, Keluar</button>
                <button onClick={() => setShowConfirmLogout(false)} className="py-4 text-slate-400 font-black text-[10px] uppercase hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Batal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
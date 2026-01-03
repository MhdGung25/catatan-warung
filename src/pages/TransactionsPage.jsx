import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, FiPlus, FiMinus, FiTrash2, 
  FiCheckCircle, FiChevronDown, FiAlertTriangle, FiX, FiSearch
} from 'react-icons/fi';

// --- DIALOG KONFIRMASI (ADAPTIF TEMA) ---
const ConfirmDialog = ({ open, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={onCancel} className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/90 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} 
          className="relative bg-white dark:bg-[#0f172a] w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-8 text-center"
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-6">
            <FiAlertTriangle size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-2 tracking-tighter">Kosongkan Keranjang?</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-8">Semua item akan dihapus dari antrean.</p>
          <div className="flex flex-col gap-3">
            <button onClick={onConfirm} className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20">Ya, Hapus Semua</button>
            <button onClick={onCancel} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-2xl uppercase text-[10px] tracking-widest">Batalkan</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function TransactionsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("current_cart") || "[]"));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("Tunai");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [errorStatus, setErrorStatus] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => { localStorage.setItem("current_cart", JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) setAvailableProducts(JSON.parse(savedProducts));
  }, []);

  const [availableMethods, setAvailableMethods] = useState(["Tunai"]);
  useEffect(() => {
    const savedPayments = localStorage.getItem("activePayments");
    if (savedPayments) {
      const parsed = JSON.parse(savedPayments);
      const active = Object.keys(parsed).filter(k => parsed[k]);
      setAvailableMethods(active.length > 0 ? active : ["Tunai"]);
    }
  }, []);

  const handleAddToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.code);
      if (ex) return prev.map(i => i.id === p.code ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.code, name: p.name, price: Number(p.price), qty: 1 }];
    });
  };

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) { setErrorStatus(false); return; }
    const match = availableProducts.find(p => p.code?.toLowerCase() === query);
    if (match) {
      handleAddToCart(match);
      setSearchQuery("");
      setErrorStatus(false);
    } else {
      setErrorStatus(!availableProducts.some(p => p.code?.toLowerCase().includes(query)));
    }
  }, [searchQuery, availableProducts]);

  const updateQty = (id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);

  const handleSelesaikanTransaksi = () => {
    if (cart.length === 0) return;
    const riwayatLama = JSON.parse(localStorage.getItem("sales_history") || "[]");
    const transaksiBaru = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      total: subtotal,
      method: selectedMethod,
      items: cart
    };
    localStorage.setItem("sales_history", JSON.stringify([...riwayatLama, transaksiBaru]));
    setCart([]);
    localStorage.removeItem("current_cart");
    alert("Transaksi Berhasil!");
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] text-slate-800 dark:text-white p-3 md:p-8 lg:p-12 transition-colors duration-500">
      <ConfirmDialog open={isConfirmOpen} onConfirm={() => {setCart([]); setIsConfirmOpen(false);}} onCancel={() => setIsConfirmOpen(false)} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-[#0f172a] p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-2xl">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase italic dark:text-white">
                  KASIR <span className="text-emerald-500">DIGITAL</span>
                </h1>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Point of Sale V2.0 PRO</p>
              </div>
              {cart.length > 0 && (
                <button onClick={() => setIsConfirmOpen(true)} className="p-3 md:p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl md:rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>

            <div className="relative">
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${errorStatus ? 'text-rose-500' : 'text-emerald-500'}`} size={18} />
              <input 
                ref={searchInputRef} autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan / Ketik SKU..."
                className={`w-full bg-slate-50 dark:bg-slate-900 border-2 py-4 pl-11 pr-4 rounded-xl md:rounded-[1.5rem] font-bold transition-all outline-none text-xs md:text-sm ${
                  errorStatus 
                  ? 'border-rose-500 text-rose-500' 
                  : 'border-transparent focus:border-emerald-500 dark:text-emerald-400 text-slate-700 focus:bg-white dark:focus:bg-slate-900 shadow-inner'
                }`}
              />
            </div>
          </div>

          {/* ITEM LIST - PERBAIKAN MOBILE DI SINI */}
          <div className="space-y-3 max-h-[50vh] lg:max-h-[55vh] overflow-y-auto pr-1 md:pr-4 custom-scrollbar">
            <AnimatePresence mode='popLayout'>
              {cart.map((item) => (
                <motion.div layout key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 p-4 md:p-5 rounded-2xl md:rounded-[2rem] bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800/50 hover:shadow-lg transition-all relative">
                  
                  {/* Info Produk (Nama & Avatar) */}
                  <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-emerald-500 border border-slate-200 dark:border-slate-700 text-base md:text-xl shadow-sm">
                      {item.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[11px] md:text-sm uppercase truncate text-slate-700 dark:text-slate-200 pr-6 md:pr-0">{item.name}</h4>
                      <p className="text-[10px] md:text-[11px] text-emerald-500 font-black mt-0.5">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Tombol Aksi (Qty & Subtotal) */}
                  <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50 dark:border-slate-800/50">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 md:p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg md:rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><FiMinus size={12} /></button>
                      <span className="font-black text-[11px] md:text-sm w-6 md:w-8 text-center dark:text-white text-slate-700">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white dark:bg-slate-800 rounded-lg md:rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><FiPlus size={12} /></button>
                    </div>
                    
                    <div className="text-right min-w-[90px] md:min-w-[120px]">
                      <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Subtotal</p>
                      <p className="text-[11px] md:text-sm font-black text-emerald-500">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Tombol Hapus Pojok Kanan Atas di Mobile */}
                  <button onClick={() => removeItem(item.id)} className="absolute top-4 right-4 p-1 text-slate-300 hover:text-rose-500 transition-colors">
                    <FiX size={18} className="md:w-5 md:h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {cart.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 md:py-24 text-center border-2 md:border-4 border-dashed border-slate-100 dark:border-slate-900 rounded-[2rem] md:rounded-[3rem]">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <FiShoppingCart size={30} className="text-slate-300 dark:text-slate-800 md:w-10 md:h-10" />
                </div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-[11px]">Keranjang Kosong</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-4 lg:sticky lg:top-8">
          <div className="bg-white dark:bg-[#0f172a] p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="mb-8 md:mb-10">
              <h3 className="text-emerald-500 font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] mb-2 md:mb-3">Total Tagihan</h3>
              <p className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter flex items-baseline">
                <span className="text-sm md:text-lg font-bold text-slate-300 dark:text-slate-600 mr-2 uppercase">Rp</span>
                {subtotal.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-3 block ml-1">Metode Bayar</label>
                <div className="relative">
                  <select 
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-800 outline-none font-black text-[10px] md:text-xs uppercase tracking-widest appearance-none cursor-pointer focus:border-emerald-500 transition-all dark:text-white text-slate-700"
                  >
                    {availableMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={handleSelesaikanTransaksi}
                  disabled={cart.length === 0}
                  className={`w-full py-5 md:py-6 rounded-2xl md:rounded-[1.8rem] font-black uppercase text-[10px] md:text-[11px] tracking-[0.1em] flex items-center justify-center gap-3 transition-all ${
                    cart.length === 0 
                    ? "bg-slate-100 dark:bg-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed shadow-none" 
                    : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 active:scale-95"
                  }`}
                >
                  <FiCheckCircle size={20} /> SELESAIKAN PESANAN
                </button>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-6 text-[8px] font-black text-slate-400 uppercase tracking-widest opacity-50">
            ID: TRX-{Math.floor(Math.random() * 1000000)}
          </p>
        </div>
      </div>
    </div>
  );
}
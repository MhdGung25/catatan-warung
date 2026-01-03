import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, FiPlus, FiMinus, FiTrash2, 
  FiCheckCircle, FiChevronDown, FiAlertTriangle, FiX, FiSearch
} from 'react-icons/fi';

// --- DIALOG KONFIRMASI ---
const ConfirmDialog = ({ open, onConfirm, onCancel }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0f172a] w-full max-w-sm rounded-3xl shadow-2xl border border-slate-800 overflow-hidden p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
            <FiAlertTriangle size={30} />
          </div>
          <h3 className="text-lg font-bold text-white uppercase mb-2">Kosongkan Keranjang?</h3>
          <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-6">Semua item akan dihapus.</p>
          <div className="flex flex-col gap-2">
            <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white font-bold rounded-xl uppercase text-[10px]">Ya, Hapus Semua</button>
            <button onClick={onCancel} className="w-full py-4 bg-slate-800 text-slate-400 font-bold rounded-xl uppercase text-[10px]">Batalkan</button>
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
  const [selectedMethod, setSelectedMethod] = useState("Tunai"); // Tambahan State Metode
  const [availableProducts, setAvailableProducts] = useState([]);
  const [errorStatus, setErrorStatus] = useState(false);
  const searchInputRef = useRef(null);

  const activePayments = { Tunai: true, QRIS: true, Transfer: true };

  useEffect(() => { localStorage.setItem("current_cart", JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) setAvailableProducts(JSON.parse(savedProducts));
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
  const availableMethods = Object.keys(activePayments).filter(k => activePayments[k]);

  // FUNGSI SIMPAN TRANSAKSI KE HISTORY
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
    
    // Reset Keranjang setelah sukses
    setCart([]);
    localStorage.removeItem("current_cart");
    alert("Transaksi Berhasil Disimpan!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-6 lg:p-10 font-sans flex justify-center items-start">
      <ConfirmDialog open={isConfirmOpen} onConfirm={() => {setCart([]); setIsConfirmOpen(false);}} onCancel={() => setIsConfirmOpen(false)} />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">KASIR <span className="text-emerald-500">DIGITAL</span></h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sistem Penjualan V2.0</p>
              </div>
              {cart.length > 0 && (
                <button onClick={() => setIsConfirmOpen(true)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>

            <div className="relative">
              <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${errorStatus ? 'text-rose-500' : 'text-emerald-500'}`} size={20} />
              <input 
                ref={searchInputRef} autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan Barcode atau Ketik SKU Produk..."
                className={`w-full bg-slate-900 border-2 py-4 pl-12 pr-12 rounded-2xl font-bold transition-all outline-none ${errorStatus ? 'border-rose-500' : 'border-slate-800 focus:border-emerald-500 text-emerald-400'}`}
              />
              {errorStatus && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-rose-500 uppercase bg-rose-500/10 px-2 py-1 rounded-md">Tidak Ditemukan</span>}
            </div>
          </div>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence mode='popLayout'>
              {cart.map((item) => (
                <motion.div layout key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#0f172a] border border-slate-800/50 hover:border-emerald-500/30 transition-all shadow-sm">
                  <div className="w-12 h-12 shrink-0 bg-slate-800 rounded-xl flex items-center justify-center font-black text-emerald-500 border border-slate-700">{item.name?.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm uppercase truncate">{item.name}</h4>
                    <p className="text-[11px] text-emerald-500 font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded-md hover:bg-emerald-500"><FiMinus size={12} /></button>
                    <span className="font-bold text-xs w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-slate-800 rounded-md hover:bg-emerald-500"><FiPlus size={12} /></button>
                  </div>
                  <div className="hidden sm:block text-right min-w-[100px]">
                    <p className="text-sm font-black text-emerald-400">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1 text-slate-600 hover:text-rose-500"><FiX size={18} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                <FiShoppingCart size={40} className="mx-auto mb-4 text-slate-800" />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Keranjang Kosong</p>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-4 lg:sticky lg:top-10">
          <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="mb-8">
              <h3 className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.3em] mb-2">Total Pembayaran</h3>
              <p className="text-5xl font-black text-white tracking-tighter">
                <span className="text-lg font-normal text-slate-600 mr-2">Rp</span>
                {subtotal.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Metode Bayar</label>
                <div className="relative">
                  <select 
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-slate-900 p-4 rounded-xl border border-slate-700 outline-none font-bold text-sm appearance-none cursor-pointer focus:border-emerald-500 transition-all"
                  >
                    {availableMethods.map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                </div>
              </div>

              <button 
                onClick={handleSelesaikanTransaksi}
                disabled={cart.length === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.1em] flex items-center justify-center gap-3 transition-all ${
                  cart.length === 0 ? "bg-slate-800 text-slate-600" : "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95 hover:bg-emerald-400"
                }`}
              >
                <FiCheckCircle size={20} /> SELESAIKAN PESANAN
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
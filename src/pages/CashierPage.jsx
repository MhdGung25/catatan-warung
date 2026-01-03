import React, { useState, useEffect, useCallback } from "react";
import { 
  FiSearch, FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiCheckCircle, FiLayout, FiHash 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function CashierPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [layout, setLayout] = useState(() => localStorage.getItem("cashierLayout") || "grid");
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [activeMethods, setActiveMethods] = useState({ Tunai: true, QRIS: false, Transfer: false });

  // Sinkronisasi data dari LocalStorage secara Real-time
  const syncEverything = useCallback(() => {
    setLayout(localStorage.getItem("cashierLayout") || "grid");
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
    
    const savedMethods = JSON.parse(localStorage.getItem("paymentMethods") || '{"Tunai": true}');
    setActiveMethods(savedMethods);

    // Jika metode yang sedang dipakai dimatikan di Settings, reset ke metode pertama yang aktif
    setPaymentMethod(current => {
      if (!savedMethods[current]) {
        return Object.keys(savedMethods).find(key => savedMethods[key]) || "Tunai";
      }
      return current;
    });
  }, []);

  useEffect(() => {
    syncEverything();
    window.addEventListener("storage", syncEverything);
    window.addEventListener("data-updated", syncEverything);
    return () => {
      window.removeEventListener("storage", syncEverything);
      window.removeEventListener("data-updated", syncEverything);
    };
  }, [syncEverything]);

  // Logika Keranjang & Transaksi
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.code === product.code);
      if (existing) {
        if (existing.qty >= product.stock) return prev;
        return prev.map(item => item.code === product.code ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const currentProducts = JSON.parse(localStorage.getItem("products") || "[]");
    
    // Potong Stok
    const updated = currentProducts.map(p => {
      const item = cart.find(c => c.code === p.code);
      return item ? { ...p, stock: p.stock - item.qty } : p;
    });

    localStorage.setItem("products", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("data-updated"));
    
    setCart([]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-10 md:pt-20 pb-10 px-4 transition-all">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AREA PRODUK */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black dark:text-white tracking-tighter uppercase">KASIR <span className="text-emerald-500">POS</span></h1>
            <div className="flex gap-4">
              <div className="hidden md:flex items-center px-4 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase">
                {layout === 'grid' ? <FiLayout className="mr-2"/> : <FiHash className="mr-2"/>} {layout}
              </div>
              <div className="relative w-64">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Cari..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border dark:border-slate-800 outline-none dark:text-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>

          <div className={layout === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
            {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
              <motion.button key={p.code} whileTap={{ scale: 0.98 }} onClick={() => addToCart(p)} className={`p-5 rounded-[2.5rem] border transition-all ${p.stock <= 0 ? 'opacity-40' : 'bg-white dark:bg-slate-900 hover:border-emerald-500'} dark:border-slate-800 flex ${layout === 'grid' ? 'flex-col' : 'items-center justify-between'}`}>
                <div className="text-left">
                  <h3 className="text-sm font-black dark:text-white uppercase truncate">{p.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">{formatIDR(p.price)}</p>
                </div>
                <div className={`flex items-center ${layout === 'grid' ? 'justify-between mt-5' : 'gap-6'}`}>
                  <span className="text-[9px] font-black px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-400">STOK: {p.stock}</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><FiPlus /></div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* AREA KERANJANG */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border dark:border-slate-800 shadow-2xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 font-black text-xs uppercase tracking-widest text-emerald-500">
              <FiShoppingCart /> Keranjang
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto mb-8 pr-2">
              {cart.length === 0 && <div className="py-20 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Keranjang Kosong</div>}
              {cart.map(item => (
                <div key={item.code} className="flex justify-between items-center">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-xs font-black dark:text-white uppercase truncate">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{formatIDR(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                      <button onClick={() => updateQty(item.code, -1)} className="p-1 dark:text-white"><FiMinus size={10}/></button>
                      <span className="px-2 text-xs font-black dark:text-white">{item.qty}</span>
                      <button onClick={() => updateQty(item.code, 1)} className="p-1 dark:text-white"><FiPlus size={10}/></button>
                    </div>
                    <button onClick={() => setCart(c => c.filter(i => i.code !== item.code))} className="text-slate-300 hover:text-rose-500"><FiTrash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t dark:border-slate-800 space-y-5">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                <span className="text-[10px] font-black uppercase text-slate-400">Metode Bayar</span>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="bg-transparent text-[11px] font-black dark:text-white outline-none cursor-pointer">
                  {Object.keys(activeMethods).map(m => activeMethods[m] && <option key={m} value={m} className="dark:bg-slate-900">{m.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Tagihan</span>
                <span className="text-3xl font-black text-emerald-500 tracking-tighter">{formatIDR(cart.reduce((s,i) => s + (i.price*i.qty), 0))}</span>
              </div>
              <button disabled={cart.length === 0} onClick={handleCheckout} className="w-full py-5 bg-emerald-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-[#020617] rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">BAYAR SEKARANG</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[99] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] text-center shadow-2xl">
              <FiCheckCircle className="text-emerald-500 size-16 mx-auto mb-4" />
              <h2 className="text-2xl font-black dark:text-white uppercase">Berhasil!</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Stok Diperbarui</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function updateQty(code, delta) {
    setCart(prev => prev.map(item => {
      if (item.code === code) {
        const newQty = item.qty + delta;
        if (newQty > 0 && newQty <= (products.find(p => p.code === code)?.stock || 0)) return { ...item, qty: newQty };
      }
      return item;
    }));
  }
}
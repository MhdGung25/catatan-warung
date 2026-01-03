import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrash2, FiSearch, FiMinus, 
  FiPlus, FiX, FiLayout, FiList, FiBox
} from 'react-icons/fi'; 

import ConfirmDialog from './cart/ConfirmDialog';
import CartSummary from './cart/CartSummary';

export default function TransactionsPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("current_cart") || "[]"));
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState(() => localStorage.getItem("cashierLayout") || "grid");
  const [selectedMethod, setSelectedMethod] = useState("Tunai");

  const searchInputRef = useRef(null);

  // --- FUNGSI SINKRONISASI TOTAL ---
  // Fungsi ini menangani Layout DAN Metode Pembayaran sekaligus
  const syncAllData = useCallback(() => {
    // 1. Sinkronisasi Layout
    const newLayout = localStorage.getItem("cashierLayout") || "grid";
    setLayout(newLayout);

    // 2. Sinkronisasi Metode Pembayaran
    const savedActive = JSON.parse(localStorage.getItem("activePayments") || '{"Tunai": true}');
    // Jika metode yang sedang terpilih dimatikan di settings, kembalikan ke Tunai
    if (savedActive && !savedActive[selectedMethod]) {
      setSelectedMethod("Tunai");
    }
    
    console.log("🔄 Data Synchronized:", { layout: newLayout });
  }, [selectedMethod]);

  // --- EFFECT UNTUK MENDENGARKAN PERUBAHAN ---
  useEffect(() => {
    // Jalankan saat pertama kali mount
    syncAllData();

    // Listen dari tab lain (Settings)
    window.addEventListener("storage", syncAllData);
    // Listen dari tab yang sama (Custom Event dari SettingsPage)
    window.addEventListener("data-updated", syncAllData);

    return () => {
      window.removeEventListener("storage", syncAllData);
      window.removeEventListener("data-updated", syncAllData);
    };
  }, [syncAllData]);

  // Simpan Cart ke LocalStorage setiap ada perubahan isi keranjang
  useEffect(() => { 
    localStorage.setItem("current_cart", JSON.stringify(cart)); 
  }, [cart]);

  // --- LOGIKA TRANSAKSI ---
  const handleAddToCart = useCallback((productCode) => {
    if (!productCode.trim()) return;
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const match = products.find(p => p.code?.toLowerCase() === productCode.toLowerCase().trim());

    if (match) {
      if (match.stock <= 0) {
        alert(`Stok ${match.name} habis!`);
        setSearchQuery("");
        return;
      }
      setCart(prev => {
        const existing = prev.find(i => i.id === match.code);
        if (existing) {
          if (existing.qty >= match.stock) {
            alert("Batas stok tercapai!");
            return prev;
          }
          return prev.map(i => i.id === match.code ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...prev, { id: match.code, name: match.name, price: Number(match.price), qty: 1, maxStock: match.stock }];
      });
      setSearchQuery("");
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 1) handleAddToCart(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleAddToCart]);

  const updateQty = (id, d) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + d;
        if (newQty > i.maxStock) {
          alert("Stok tidak mencukupi!");
          return i;
        }
        return { ...i, qty: Math.max(1, newQty) };
      }
      return i;
    }));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const currentProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const salesHistory = JSON.parse(localStorage.getItem("sales_history") || "[]");

    const updatedProducts = currentProducts.map(p => {
      const cartItem = cart.find(item => item.id === p.code);
      return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.qty) } : p;
    });

    const newTransaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((acc, i) => acc + (i.price * i.qty), 0),
      method: selectedMethod
    };

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    localStorage.setItem("sales_history", JSON.stringify([newTransaction, ...salesHistory]));
    
    // Trigger update ke seluruh aplikasi
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("data-updated"));

    setCart([]);
    alert("Pesanan Berhasil Diselesaikan!");
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] pb-20 pt-10 md:pt-24 px-4 md:px-8 transition-all duration-500">
      <ConfirmDialog 
        open={isConfirmOpen} 
        onConfirm={() => {setCart([]); setIsConfirmOpen(false);}} 
        onCancel={() => setIsConfirmOpen(false)} 
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-4xl font-black dark:text-white italic uppercase tracking-tighter">
            KASIR<span className="text-emerald-500">POS</span>
          </h1>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-800 shadow-sm flex items-center gap-4 px-6">
            <FiBox className="text-emerald-500" size={24} />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Total Items</p>
              <p className="text-xl font-black dark:text-white">{cart.reduce((a, b) => a + b.qty, 0)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bagian Kiri: Pencarian & List Produk */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  {layout === 'grid' ? <FiLayout /> : <FiList />} {layout.toUpperCase()} VIEW ACTIVE
                </label>
                {cart.length > 0 && (
                  <button onClick={() => setIsConfirmOpen(true)} className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase hover:opacity-70 transition-opacity">
                    <FiTrash2 size={14} /> Kosongkan Keranjang
                  </button>
                )}
              </div>
              <div className="relative">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                <input 
                  ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scan SKU atau Ketik Nama Produk..."
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border-2 border-transparent focus:border-emerald-500 py-5 pl-16 rounded-2xl font-bold dark:text-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Render List Berdasarkan Layout */}
            <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
              <AnimatePresence mode='popLayout'>
                {cart.map((item) => (
                  <motion.div 
                    key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className={`bg-white dark:bg-slate-900 border dark:border-slate-800 flex items-center gap-4 shadow-sm transition-all
                      ${layout === 'grid' ? 'p-6 rounded-[2.5rem] flex-col text-center' : 'p-4 rounded-2xl'}`}
                  >
                    <div className={`bg-emerald-500/10 rounded-xl flex items-center justify-center font-black text-emerald-500 uppercase
                      ${layout === 'grid' ? 'w-20 h-20 text-2xl' : 'w-12 h-12 text-base'}`}>
                      {item.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black dark:text-white uppercase truncate">{item.name}</h4>
                      <p className="text-[10px] text-emerald-500 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Stok: {item.maxStock}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                        <button onClick={() => updateQty(item.id, -1)} className="p-2 hover:bg-emerald-500 hover:text-white rounded-lg transition-all dark:text-white"><FiMinus size={12}/></button>
                        <span className="w-8 text-center text-sm font-black dark:text-white">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-2 hover:bg-emerald-500 hover:text-white rounded-lg transition-all dark:text-white"><FiPlus size={12}/></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><FiX size={18}/></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cart.length === 0 && (
                <div className="text-center py-20 opacity-20">
                  <FiBox size={60} className="mx-auto mb-4" />
                  <p className="font-black uppercase text-sm tracking-widest dark:text-white">Keranjang Kosong</p>
                </div>
              )}
            </div>
          </div>

          {/* Bagian Kanan: Summary & Pembayaran */}
          <div className="lg:col-span-4">
            <CartSummary 
              subtotal={cart.reduce((acc, i) => acc + (i.price * i.qty), 0)}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              cartLength={cart.length}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
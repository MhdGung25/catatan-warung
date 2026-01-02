import React, { useState, useEffect, useRef } from "react";
import {
  FiTrash2, FiPlus, FiMinus, FiPrinter, FiSearch,
  FiCreditCard, FiSmartphone, FiHome, FiCopy,
  FiPackage, FiCheckCircle, FiShoppingCart, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Custom Hooks
import useCart from "../hooks/useCart";
import useKeyboard from "../hooks/useKeyboard";

function TransactionPage() {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const { cart, addItem, removeItem, clearCart, totalQty, totalPrice } = useCart();
  
  const [searchCode, setSearchCode] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false); 

  // State sinkronisasi dari halaman Settings
  const [warungInfo, setWarungInfo] = useState({
    name: "Warung Digital",
    address: "Alamat belum diatur",
    email: "admin@mail.com",
    qrisName: "KASIR DIGITAL",
    nmid: "ID1020304050607",
    bankAccount: "BCA - 12345678",
    headerReceipt: "--- RECEIPT ---",
    footerReceipt: "Terima kasih sudah belanja 🙏"
  });

  const searchInputRef = useRef(null);

  // --- SYNC DATA DARI LOCAL STORAGE ---
  const loadSettings = () => {
    setWarungInfo({
      name: localStorage.getItem("warung_name") || "Warung Digital",
      address: localStorage.getItem("warung_address") || "Alamat belum diatur",
      email: localStorage.getItem("warung_email") || "admin@mail.com",
      qrisName: localStorage.getItem("merchant_name") || "KASIR DIGITAL",
      nmid: localStorage.getItem("nmid") || "ID1020304050607", 
      bankAccount: localStorage.getItem("bank_account") || "BCA - 12345678",
      headerReceipt: localStorage.getItem("header_receipt") || "--- RECEIPT ---",
      footerReceipt: localStorage.getItem("footer_receipt") || "Terima kasih sudah belanja 🙏",
    });
  };

  useEffect(() => {
    loadSettings();
    const savedProducts = localStorage.getItem("warung_products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    
    const timer = setTimeout(() => searchInputRef.current?.focus(), 500);
    window.addEventListener("storage", loadSettings);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  // --- LOGIC TRANSAKSI ---
  const change = (paymentMethod === "cash" && cashReceived) ? parseInt(cashReceived) - totalPrice : 0;

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = (e) => {
    if (e) e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    if (!cleanCode) return;

    const product = products.find(p => p.code === cleanCode);
    
    if (!product) {
      alert("❌ Produk tidak ditemukan!");
    } else if (Number(product.stock) <= 0) {
      alert("⚠️ Stok habis!");
    } else {
      addItem(product);
    }
    setSearchCode("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === "cash") {
      const cashValue = parseInt(cashReceived) || 0;
      if (cashValue < totalPrice) {
        alert("⚠️ Uang tunai kurang!");
        return;
      }
    }

    const tid = `WD-${Date.now().toString().slice(-8)}`;
    setTransactionId(tid);

    // Update Stok
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.code === p.code);
      if (cartItem) return { ...p, stock: Math.max(0, Number(p.stock) - cartItem.qty) };
      return p;
    });
    
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Simpan Data Penjualan
    const saleData = {
      id: tid,
      date: new Date().toLocaleString(),
      items: [...cart],
      total: totalPrice,
      method: paymentMethod,
      cash: paymentMethod === 'cash' ? parseInt(cashReceived) : totalPrice,
      change: paymentMethod === 'cash' ? (parseInt(cashReceived) - totalPrice) : 0
    };

    const existingSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    localStorage.setItem("warung_sales", JSON.stringify([saleData, ...existingSales]));

    // --- INTEGRASI NOTIFIKASI ---
    // Memicu munculnya badge merah di TopBar
    localStorage.setItem("notif_read", "false");

    setShowReceipt(true);
  };

  const resetTransaction = () => {
    clearCart();
    setCashReceived("");
    setPaymentMethod("cash");
    setShowReceipt(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  useKeyboard({
    onPay: handleCheckout,
    onFocusSearch: () => searchInputRef.current?.focus(),
    onClear: () => { 
      if (cart.length > 0 && window.confirm("Kosongkan keranjang?")) clearCart(); 
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-20 pb-10 px-3 md:px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg"><FiShoppingCart size={24} /></div>
          <h1 className="text-xl md:text-3xl font-black dark:text-white uppercase">POS <span className="text-emerald-500">KASIR</span></h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KOLOM KIRI: SCAN & ITEM LIST */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-[#0f172a] p-2 rounded-2xl border-2 border-emerald-500/10 shadow-sm focus-within:border-emerald-500">
              <form onSubmit={handleAddToCart} className="relative flex items-center">
                <FiSearch className="absolute left-4 text-slate-400" size={20} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-transparent dark:text-white font-bold outline-none uppercase" 
                  placeholder="SCAN BARCODE / MASUKKAN KODE..." 
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </form>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-sm border dark:border-slate-800 flex flex-col min-h-[450px]">
              <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold dark:text-white text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <FiPackage className="text-emerald-500" /> Item Terpilih ({totalQty})
                </h3>
                <button onClick={() => clearCart()} className="text-[10px] font-black text-rose-500 uppercase">Reset</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 dark:text-white">
                    <FiShoppingCart size={64} />
                    <p className="font-black mt-2 uppercase">Keranjang Kosong</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.code} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border dark:border-slate-700/50 shadow-sm">
                      <div className="flex-1">
                        <p className="font-black text-slate-800 dark:text-white uppercase text-sm">{item.name}</p>
                        <p className="text-xs text-emerald-500 font-bold">Rp {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border dark:border-slate-700">
                          <button onClick={() => addItem({...item, qty: -1})} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500"><FiMinus/></button>
                          <span className="w-8 text-center font-black dark:text-white text-sm">{item.qty}</span>
                          <button onClick={() => addItem(item)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500"><FiPlus/></button>
                        </div>
                        <p className="font-black dark:text-white text-sm w-20 text-right">Rp {(item.price * item.qty).toLocaleString()}</p>
                        <button onClick={() => removeItem(item.code)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><FiTrash2 size={18}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: PEMBAYARAN */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-xl border dark:border-slate-800 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2rem] text-center shadow-inner overflow-hidden">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Total Tagihan</p>
                <p className="text-5xl font-black text-white flex justify-center items-center gap-2">
                  <span className="text-lg text-emerald-500 italic">Rp</span>
                  {totalPrice.toLocaleString()}
                </p>
              </div>

              {/* Toggle Metode Pembayaran */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'cash', icon: <FiCreditCard />, label: 'TUNAI' },
                  { id: 'qris', icon: <FiSmartphone />, label: 'QRIS' },
                  { id: 'bank', icon: <FiHome />, label: 'BANK' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => { setPaymentMethod(m.id); setCashReceived(""); }}
                    className={`flex flex-col items-center justify-center py-5 rounded-[1.5rem] border-2 transition-all ${
                      paymentMethod === m.id 
                      ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5 shadow-md scale-105' 
                      : 'border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400'
                    }`}
                  >
                    <span className="text-2xl mb-1">{m.icon}</span>
                    <span className="text-[9px] font-black">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="min-h-[140px]">
                <AnimatePresence mode="wait">
                  {paymentMethod === 'cash' ? (
                    <motion.div key="cash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-2xl">Rp</span>
                        <input 
                          type="number" 
                          className="w-full pl-16 pr-8 py-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 dark:text-white font-black text-3xl outline-none border-2 border-transparent focus:border-emerald-500 text-right" 
                          placeholder="0"
                          value={cashReceived}
                          onChange={(e) => setCashReceived(e.target.value)}
                        />
                      </div>
                      {cashReceived && (
                        <div className={`flex justify-between items-center p-5 rounded-2xl ${change >= 0 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'} text-white shadow-lg`}>
                          <span className="text-[10px] font-black uppercase">{change >= 0 ? 'Kembali' : 'Kurang'}</span>
                          <span className="text-2xl font-black">Rp {Math.abs(change).toLocaleString()}</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="non-cash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                          {paymentMethod === 'qris' ? 'Merchant QRIS' : 'Rekening Bank'}
                        </span>
                        <button onClick={() => copyToClipboard(paymentMethod === 'qris' ? warungInfo.nmid : warungInfo.bankAccount)} className="text-[9px] font-black uppercase flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
                          {copied ? <><FiCheckCircle className="text-emerald-500"/> Tersalin</> : <><FiCopy/> Salin</>}
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">{paymentMethod === 'qris' ? warungInfo.qrisName : 'Transfer Ke:'}</p>
                      <p className="font-mono text-xl font-black dark:text-white break-all">{paymentMethod === 'qris' ? warungInfo.nmid : warungInfo.bankAccount}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 text-white font-black rounded-[1.5rem] shadow-xl uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
              >
                <FiPrinter size={20} /> Selesaikan (F9)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STRUK */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-emerald-500"></div>
              <button onClick={() => setShowReceipt(false)} className="absolute top-8 right-8 text-slate-300 hover:text-rose-500 transition-colors"><FiX size={28}/></button>
              
              <div className="text-center font-mono text-slate-800">
                <h2 className="text-xl font-black uppercase tracking-tighter mb-1">{warungInfo.name}</h2>
                <p className="text-[10px] opacity-60">{warungInfo.address}</p>
                <p className="text-[10px] opacity-60 mb-6">{warungInfo.email}</p>
                
                <p className="text-xs font-bold mb-4">{warungInfo.headerReceipt}</p>
                <div className="border-b border-dashed border-slate-300 mb-4"></div>
                
                <div className="space-y-3 text-left mb-6 text-xs">
                  {cart.map(item => (
                    <div key={item.code} className="flex flex-col">
                      <div className="flex justify-between font-bold uppercase">
                        <span>{item.name}</span>
                        <span>{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                      <span className="opacity-60">{item.qty} x {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-slate-300 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between font-black text-lg uppercase">
                    <span>Total</span><span>Rp {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] opacity-70 uppercase font-bold">
                    <span>Bayar ({paymentMethod})</span><span>{paymentMethod === 'cash' ? parseInt(cashReceived).toLocaleString() : totalPrice.toLocaleString()}</span>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="flex justify-between text-[10px] opacity-70 uppercase font-bold">
                      <span>Kembali</span><span>{change.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-bold mb-8">{warungInfo.footerReceipt}</p>
                <p className="text-[9px] opacity-40 uppercase">{new Date().toLocaleString()} - {transactionId}</p>
              </div>
              
              <button onClick={resetTransaction} className="w-full mt-8 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl">Transaksi Baru</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TransactionPage;
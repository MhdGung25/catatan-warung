import React, { useState, useEffect, useRef } from "react";
import { 
  FiTrash2, FiPlus, FiMinus, 
  FiPrinter, FiSearch, FiCreditCard,
  FiSmartphone, FiHome, FiCopy,
  FiPackage, FiCheckCircle, FiShoppingCart
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function TransactionPage() {
  // AMBIL DATA AWAL LANGSUNG DARI LOCALSTORAGE AGAR TIDAK HILANG SAAT REFRESH
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("warung_products");
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("warung_cart_temp");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchCode, setSearchCode] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  const [warungInfo, setWarungInfo] = useState({
    name: localStorage.getItem("warung_name") || "Warung Digital",
    phone: localStorage.getItem("warung_user_phone") || "",
    bank: localStorage.getItem("warung_user_bank") || "",
    autoPrint: localStorage.getItem("auto_print") === "true",
    enableQRIS: localStorage.getItem("enable_qris") === "true"
  });

  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const searchInputRef = useRef(null);

  // SIMPAN SETIAP PERUBAHAN KERANJANG
  useEffect(() => {
    localStorage.setItem("warung_cart_temp", JSON.stringify(cart));
  }, [cart]);

  // SINKRONISASI DATA PRODUK DAN SETTING JIKA ADA PERUBAHAN DI HALAMAN LAIN
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem("warung_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      
      setWarungInfo({
        name: localStorage.getItem("warung_name") || "Warung Digital",
        phone: localStorage.getItem("warung_user_phone") || "",
        bank: localStorage.getItem("warung_user_bank") || "",
        autoPrint: localStorage.getItem("auto_print") === "true",
        enableQRIS: localStorage.getItem("enable_qris") === "true"
      });
    };

    window.addEventListener("storage", handleStorageChange);
    if (searchInputRef.current) searchInputRef.current.focus();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    if (!cleanCode) return;

    const product = products.find(p => p.code === cleanCode);
    
    if (!product) {
      alert("❌ Produk tidak ditemukan!");
      setSearchCode("");
      return;
    }

    if (Number(product.stock) <= 0) {
      alert("⚠️ Stok habis!");
      setSearchCode("");
      return;
    }

    const existingItem = cart.find(item => item.code === product.code);
    if (existingItem) {
      if (existingItem.quantity + 1 > Number(product.stock)) {
        alert("⚠️ Stok tidak mencukupi!");
      } else {
        setCart(cart.map(item => 
          item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([{ ...product, quantity: 1 }, ...cart]);
    }
    setSearchCode("");
  };

  const updateQuantity = (code, delta) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.code === code) {
        const product = products.find(p => p.code === code);
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= Number(product.stock)) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const change = paymentMethod === "cash" && cashReceived ? parseInt(cashReceived) - totalPrice : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === "cash" && (parseInt(cashReceived) < totalPrice || !cashReceived)) {
      alert("⚠️ Uang tunai kurang!");
      return;
    }

    const tid = `WD-${Date.now().toString().slice(-8)}`;
    setTransactionId(tid);

    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.code === p.code);
      if (cartItem) return { ...p, stock: Number(p.stock) - cartItem.quantity };
      return p;
    });
    
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    const saleData = {
      id: tid,
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
      method: paymentMethod
    };

    const existingSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    localStorage.setItem("warung_sales", JSON.stringify([saleData, ...existingSales]));
    
    setShowReceipt(true);
  };

  const resetTransaction = () => {
    setCart([]);
    localStorage.removeItem("warung_cart_temp");
    setCashReceived("");
    setShowReceipt(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-slate-50 dark:bg-[#020617] pb-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header - Adaptive for Mobile */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black dark:text-white uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
              <FiShoppingCart className="text-emerald-500" /> Transaksi Warung Digital
            </h1>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{warungInfo.name} • System Active</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white dark:bg-[#0f172a] px-5 py-2 rounded-2xl border dark:border-slate-800 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">Kasir Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* SISI KIRI: Search & Keranjang */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-2 md:p-3 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border-2 border-emerald-500">
              <form onSubmit={handleAddToCart} className="relative">
                <FiSearch className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="w-full pl-12 md:pl-16 pr-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.8rem] bg-transparent dark:text-white font-bold outline-none text-sm md:text-base" 
                  placeholder="Scan barcode..." 
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </form>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border dark:border-slate-800 overflow-hidden">
              <div className="p-4 md:p-6 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-black dark:text-white text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                  <FiPackage className="text-emerald-500" /> Keranjang ({cart.length})
                </h3>
                <button 
                  onClick={() => {setCart([]); localStorage.removeItem("warung_cart_temp");}}
                  className="text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest"
                >
                  Bersihkan
                </button>
              </div>
              
              <div className="max-h-[350px] md:max-h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-10 text-center opacity-20 flex flex-col items-center">
                    <FiShoppingCart size={40} />
                    <p className="text-[10px] font-black mt-2 uppercase">Belum ada barang</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        key={item.code} 
                        className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 dark:bg-[#020617] p-4 rounded-[1.5rem] gap-3"
                      >
                        <div className="flex-1">
                          <p className="font-black text-slate-800 dark:text-white uppercase text-xs md:text-sm">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold">Rp {Number(item.price).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                          <div className="flex items-center bg-white dark:bg-[#0f172a] rounded-lg p-1 border">
                            <button onClick={() => updateQuantity(item.code, -1)} className="p-1 md:p-2 text-slate-400 hover:text-red-500"><FiMinus size={12}/></button>
                            <span className="w-6 md:w-8 text-center font-black dark:text-white text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.code, 1)} className="p-1 md:p-2 text-slate-400 hover:text-emerald-500"><FiPlus size={12}/></button>
                          </div>
                          <p className="font-black text-emerald-500 text-xs md:text-sm">Rp {(item.price * item.quantity).toLocaleString()}</p>
                          <button onClick={() => setCart(cart.filter(c => c.code !== item.code))} className="text-slate-300 hover:text-red-500"><FiTrash2 size={16}/></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* SISI KANAN: Pembayaran */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border dark:border-slate-800">
              <h3 className="font-black mb-6 dark:text-white text-[10px] uppercase text-center tracking-[0.2em]">Ringkasan Pembayaran</h3>
              
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                {[
                  { id: 'cash', icon: <FiCreditCard />, label: 'Tunai' },
                  { id: 'qris', icon: <FiSmartphone />, label: 'QRIS', disabled: !warungInfo.enableQRIS },
                  { id: 'bank', icon: <FiHome />, label: 'Bank', disabled: !warungInfo.enableQRIS }
                ].map((m) => (
                  <button 
                    key={m.id}
                    disabled={m.disabled}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center py-3 md:py-5 rounded-[1rem] md:rounded-[1.5rem] border-2 transition-all relative ${m.disabled ? 'opacity-20 grayscale' : ''} ${paymentMethod === m.id ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}
                  >
                    <span className="text-lg md:text-xl">{m.icon}</span>
                    <span className="text-[8px] md:text-[9px] font-black uppercase mt-1">{m.label}</span>
                    {paymentMethod === m.id && <FiCheckCircle className="absolute top-2 right-2 text-[10px]" />}
                  </button>
                ))}
              </div>

              {/* Total Display */}
              <div className="bg-slate-900 dark:bg-black p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] text-center mb-6">
                <p className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Bayar</p>
                <p className="text-3xl md:text-4xl font-black text-white">
                  <span className="text-sm md:text-lg text-emerald-500 mr-1">Rp</span>{totalPrice.toLocaleString()}
                </p>
              </div>

              {/* Info QRIS/Bank if selected */}
              {paymentMethod !== 'cash' && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black uppercase dark:text-white">{paymentMethod === 'qris' ? 'No. QRIS' : 'No. Rekening'}</span>
                    <button onClick={() => copyToClipboard(paymentMethod === 'qris' ? warungInfo.phone : warungInfo.bank)} className="text-[8px] font-black uppercase flex items-center gap-1 text-emerald-600">
                      {copied ? <><FiCheckCircle/> Tersalin</> : <><FiCopy/> Salin</>}
                    </button>
                  </div>
                  <p className="font-mono text-xs font-bold dark:text-emerald-400">{paymentMethod === 'qris' ? warungInfo.phone : warungInfo.bank}</p>
                </div>
              )}

              <input 
                type="number" 
                className="w-full p-4 md:p-5 mb-4 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black text-center text-xl md:text-2xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                placeholder="Uang Tunai..."
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
              />
              
              {cashReceived && (
                <div className="flex justify-between items-center mb-6 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Kembalian</span>
                  <span className="text-lg font-black text-emerald-500">Rp {change > 0 ? change.toLocaleString() : 0}</span>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-5 md:py-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white font-black rounded-[1.5rem] md:rounded-[2rem] shadow-xl uppercase text-[10px] md:text-xs tracking-widest transition-all active:scale-95"
              >
                <FiPrinter size={16} className="inline mr-2" /> Selesaikan Transaksi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STRUK MODAL */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl">
              <div className="text-center font-mono text-[10px] md:text-[11px] text-black">
                <h2 className="text-lg md:text-xl font-black uppercase mb-1">{warungInfo.name}</h2>
                <p className="text-[8px] opacity-60">ID: {transactionId}</p>
                <div className="border-b border-dashed my-4 border-black"></div>
                {cart.map(item => (
                  <div key={item.code} className="flex justify-between mb-1">
                    <span className="uppercase text-left max-w-[150px] truncate">{item.name} x{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-black mt-4 pt-2 font-black flex justify-between text-sm md:text-base">
                  <span>TOTAL</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                {paymentMethod === 'cash' && (
                  <div className="mt-1 flex justify-between opacity-70">
                    <span>TUNAI / KEMBALI</span>
                    <span>{parseInt(cashReceived).toLocaleString()} / {change.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={resetTransaction} 
                className="w-full mt-6 md:mt-8 py-4 bg-emerald-500 text-white font-black rounded-xl md:rounded-2xl uppercase text-[10px] tracking-widest"
              >
                Transaksi Baru
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TransactionPage;
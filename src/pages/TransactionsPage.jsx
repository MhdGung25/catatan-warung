import React, { useState, useEffect, useRef } from "react";
import { 
  FiTrash2, FiPlus, FiMinus, 
  FiPrinter, FiSearch, FiCreditCard,
  FiSmartphone, FiHome, FiCopy,
  FiPackage, FiZap, FiCheckCircle, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function TransactionPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  // --- STATE DARI SETTINGS ---
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

  // Sync data saat localStorage berubah di tab/halaman lain
  useEffect(() => {
    const syncSettings = () => {
      setWarungInfo({
        name: localStorage.getItem("warung_name") || "Warung Digital",
        phone: localStorage.getItem("warung_user_phone") || "",
        bank: localStorage.getItem("warung_user_bank") || "",
        autoPrint: localStorage.getItem("auto_print") === "true",
        enableQRIS: localStorage.getItem("enable_qris") === "true"
      });
      
      const savedProducts = localStorage.getItem("warung_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    };

    syncSettings();
    window.addEventListener("storage", syncSettings);
    if (searchInputRef.current) searchInputRef.current.focus();

    return () => window.removeEventListener("storage", syncSettings);
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
        alert("⚠️ Melebihi stok yang tersedia!");
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
    setCart(cart.map(item => {
      if (item.code === code) {
        const product = products.find(p => p.code === code);
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= Number(product.stock)) {
          return { ...item, quantity: newQty };
        } else if (newQty > Number(product.stock)) {
          alert("⚠️ Stok tidak mencukupi!");
        }
      }
      return item;
    }));
  };

  const removeFromCart = (code) => setCart(cart.filter(item => item.code !== code));

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const change = paymentMethod === "cash" && cashReceived ? parseInt(cashReceived) - totalPrice : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (paymentMethod === "cash" && (parseInt(cashReceived) < totalPrice || !cashReceived)) {
      alert("⚠️ Uang tunai tidak cukup!");
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
      method: paymentMethod,
      cashReceived: paymentMethod === 'cash' ? parseInt(cashReceived) : totalPrice,
      change: change
    };

    const existingSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    localStorage.setItem("warung_sales", JSON.stringify([saleData, ...existingSales]));
    
    setShowReceipt(true);

    // LOGIKA OTOMATIS: Auto Print jika diaktifkan di Settings
    if (warungInfo.autoPrint) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTransaction = () => {
    setCart([]);
    setCashReceived("");
    setPaymentMethod("cash");
    setShowReceipt(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50 dark:bg-[#020617] font-sans pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <FiZap className="text-emerald-500" /> POS Terminal
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{warungInfo.name} • System Active</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-[#0f172a] px-6 py-3 rounded-2xl border dark:border-slate-800 shadow-sm">
            {warungInfo.autoPrint && <span className="text-[8px] bg-blue-500 text-white px-2 py-1 rounded-md font-black uppercase mr-2">Auto-Print On</span>}
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">Kasir Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Search Box */}
            <div className="bg-white dark:bg-[#0f172a] p-3 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
              <form onSubmit={handleAddToCart} className="relative">
                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  ref={searchInputRef} 
                  type="text" 
                  className="w-full pl-16 pr-6 py-5 rounded-[1.8rem] bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all" 
                  placeholder="Scan barcode atau ketik kode..." 
                  value={searchCode} 
                  onChange={(e) => setSearchCode(e.target.value)} 
                />
              </form>
            </div>

            {/* Cart List */}
            <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-sm border dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-black dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                  <FiPackage className="text-emerald-500" /> Item Belanja ({cart.length})
                </h3>
                <button onClick={() => setCart([])} className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 px-3 py-1 rounded-full transition-all">Kosongkan</button>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-20">
                    <FiPackage size={60} />
                    <p className="font-black uppercase text-[10px] mt-4 tracking-[0.2em]">Belum ada barang</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.code} 
                        className="flex items-center justify-between bg-slate-50 dark:bg-[#020617] p-5 rounded-[2rem] border dark:border-slate-800 group"
                      >
                        <div className="flex-1">
                          <p className="font-black text-slate-800 dark:text-white uppercase text-sm">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">@{Number(item.price).toLocaleString()}</p>
                            {Number(item.stock) < 5 && (
                               <span className="text-[8px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded font-black uppercase">Stok Sisa: {item.stock}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center bg-white dark:bg-[#0f172a] rounded-xl p-1 border dark:border-slate-800 shadow-sm">
                            <button onClick={() => updateQuantity(item.code, -1)} className="p-2 text-slate-400 hover:text-red-500"><FiMinus size={12}/></button>
                            <span className="w-8 text-center font-black dark:text-white text-xs">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.code, 1)} className="p-2 text-slate-400 hover:text-emerald-500"><FiPlus size={12}/></button>
                          </div>
                          <p className="font-black text-emerald-500 min-w-[80px] text-right text-sm">Rp {(Number(item.price) * item.quantity).toLocaleString()}</p>
                          <button onClick={() => removeFromCart(item.code)} className="text-slate-300 hover:text-red-500 transition-colors"><FiTrash2 size={18}/></button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] shadow-xl sticky top-28 border dark:border-slate-800">
              <h3 className="font-black mb-8 dark:text-white text-[10px] uppercase tracking-[0.3em] text-center">Pembayaran</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { id: 'cash', icon: <FiCreditCard />, label: 'Tunai' },
                  { id: 'wallet', icon: <FiSmartphone />, label: 'QRIS', disabled: !warungInfo.enableQRIS },
                  { id: 'bank', icon: <FiHome />, label: 'Transfer', disabled: !warungInfo.enableQRIS },
                ].map(m => (
                  <button 
                    key={m.id} 
                    disabled={m.disabled}
                    onClick={() => setPaymentMethod(m.id)} 
                    className={`flex flex-col items-center py-5 rounded-[1.5rem] border-2 transition-all relative ${m.disabled ? 'opacity-30 grayscale cursor-not-allowed' : ''} ${paymentMethod === m.id ? 'border-emerald-500 bg-emerald-500/5 text-emerald-500' : 'border-slate-50 dark:border-slate-800 text-slate-400'}`}
                  >
                    <span className="text-xl mb-2">{m.icon}</span>
                    <span className="text-[9px] font-black uppercase">{m.label}</span>
                    {paymentMethod === m.id && <FiCheckCircle className="absolute top-2 right-2 text-xs" />}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-[#020617] p-6 rounded-[2rem] text-center border dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20"></div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                  <p className="text-4xl font-black dark:text-white tracking-tighter">
                    <span className="text-lg text-emerald-500 mr-1">Rp</span>{totalPrice.toLocaleString()}
                  </p>
                </div>

                {paymentMethod === 'cash' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <input 
                      type="number" 
                      className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black text-center text-2xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-inner" 
                      placeholder="Uang Diterima..." 
                      value={cashReceived} 
                      onChange={(e) => setCashReceived(e.target.value)} 
                    />
                    {cashReceived && (
                      <div className={`p-4 rounded-2xl flex justify-between items-center font-black ${change < 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        <span className="text-[10px] uppercase">Kembalian</span>
                        <span className="text-lg">Rp {Math.max(0, change).toLocaleString()}</span>
                      </div>
                    )}
                  </motion.div>
                )}

                {(paymentMethod === 'wallet' || paymentMethod === 'bank') && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 text-center">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-4">Pindai atau Transfer ke:</p>
                    <div className="bg-white dark:bg-[#020617] p-5 rounded-2xl border dark:border-slate-800 space-y-3">
                      <div className="w-32 h-32 bg-slate-100 mx-auto rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                        <FiSmartphone size={40} className="text-slate-300" />
                      </div>
                      <p className="font-black text-xs dark:text-white uppercase">{paymentMethod === 'wallet' ? 'E-Wallet' : 'Rekening Bank'}</p>
                      <p className="text-sm font-black text-emerald-500 tracking-wider">
                        {paymentMethod === 'wallet' ? (warungInfo.phone || "08xx-xxxx") : (warungInfo.bank || "BANK-XXXX")}
                      </p>
                      <button 
                        onClick={() => copyToClipboard(paymentMethod === 'wallet' ? warungInfo.phone : warungInfo.bank)} 
                        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                      >
                        {copied ? <><FiCheckCircle/> Tersalin</> : <><FiCopy/> Salin Data</>}
                      </button>
                    </div>
                  </motion.div>
                )}

                <button 
                  onClick={handleCheckout} 
                  disabled={cart.length === 0} 
                  className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95"
                >
                  <FiPrinter size={18} /> Konfirmasi & {warungInfo.autoPrint ? 'Cetak' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STRUK (VERSI LENGKAP) */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative shadow-2xl"
            >
              <button onClick={resetTransaction} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><FiX size={24}/></button>
              
              <div id="printable-receipt" className="font-mono text-[11px] text-slate-800 p-2">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black tracking-tighter uppercase">{warungInfo.name}</h2>
                  <p className="text-[8px] opacity-60">Smart POS System • Struk Belanja</p>
                  <div className="border-b border-dashed my-4 border-slate-300"></div>
                </div>
                
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between"><span>No Transaksi:</span> <span className="font-bold">{transactionId}</span></div>
                  <div className="flex justify-between"><span>Waktu:</span> <span>{new Date().toLocaleDateString('id-ID')}</span></div>
                  <div className="flex justify-between"><span>Metode:</span> <span className="uppercase font-bold">{paymentMethod}</span></div>
                </div>
                
                <div className="border-b border-dashed my-4 border-slate-300"></div>
                
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.code} className="flex flex-col">
                      <div className="flex justify-between font-bold">
                        <span className="uppercase">{item.name}</span>
                        <span>{(Number(item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                      <span className="text-[9px] opacity-60">{item.quantity} x @{Number(item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-double border-slate-800 pt-4 flex justify-between font-black text-lg">
                  <span>TOTAL</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                
                {paymentMethod === 'cash' && (
                  <div className="space-y-1 mt-4 opacity-70 text-[10px]">
                    <div className="flex justify-between"><span>Tunai:</span> <span>Rp {parseInt(cashReceived).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Kembali:</span> <span>Rp {change.toLocaleString()}</span></div>
                  </div>
                )}

                <div className="text-center mt-10 italic opacity-40 text-[8px] uppercase tracking-widest leading-relaxed">
                  <p>Barang yang sudah dibeli</p>
                  <p>tidak dapat ditukar/dikembalikan</p>
                  <p className="mt-2">--- Terima Kasih ---</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 print:hidden">
                <button onClick={() => window.print()} className="w-full py-4 bg-slate-100 text-slate-800 font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                  <FiPrinter /> Cetak Struk Ulang
                </button>
                <button onClick={resetTransaction} className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                  Selesai / Transaksi Baru
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TransactionPage;
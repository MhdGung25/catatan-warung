import React, { useState, useEffect, useRef } from "react";
import { 
  FiShoppingCart, FiTrash2, FiPlus, FiMinus, 
  FiPrinter, FiSearch, FiCreditCard,
  FiSmartphone, FiHome, FiCopy, FiCheck,
  FiPackage, FiAlertCircle, FiZap, FiX
} from "react-icons/fi";

function TransactionPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  // State untuk Wallet & Bank
  const [walletNumber, setWalletNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("BCA - 1234567890 (A/N AGUNG)"); 
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const searchInputRef = useRef(null);

  // Load data produk dari localStorage saat halaman dibuka
  useEffect(() => {
    const savedProducts = localStorage.getItem("warung_products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (searchInputRef.current) searchInputRef.current.focus();
    
    const savedBank = localStorage.getItem("warung_bank_info");
    if (savedBank) setBankAccount(savedBank);
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
    if (paymentMethod === "wallet" && !walletNumber) {
      alert("⚠️ Masukkan nomor HP E-Wallet!");
      return;
    }

    const tid = `WD-${Date.now().toString().slice(-8)}`;
    setTransactionId(tid);

    // Update Stok di Master Data
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.code === p.code);
      if (cartItem) return { ...p, stock: Number(p.stock) - cartItem.quantity };
      return p;
    });
    
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Simpan ke Riwayat Penjualan
    const saleData = {
      id: tid,
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
      method: paymentMethod,
      walletInfo: paymentMethod === 'wallet' ? walletNumber : null,
      cash: paymentMethod === 'cash' ? parseInt(cashReceived) : totalPrice,
      change: change
    };

    const existingSales = JSON.parse(localStorage.getItem("warung_sales") || "[]");
    localStorage.setItem("warung_sales", JSON.stringify([saleData, ...existingSales]));
    
    setShowReceipt(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTransaction = () => {
    setCart([]);
    setCashReceived("");
    setWalletNumber("");
    setPaymentMethod("cash");
    setShowReceipt(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
              <FiZap className="text-emerald-500" size={28} /> Kasir Penjualan
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Proses transaksi cepat & otomatis</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">Sistem Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Search & Cart */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-2 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 group">
              <form onSubmit={handleAddToCart} className="relative flex items-center">
                <div className="absolute left-6 flex items-center justify-center pointer-events-none">
                  <FiSearch className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
                </div>
                <input 
                  ref={searchInputRef} 
                  type="text" 
                  className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500/50 transition-all shadow-inner" 
                  placeholder="Scan barcode atau ketik kode barang (Enter)..." 
                  value={searchCode} 
                  onChange={(e) => setSearchCode(e.target.value)} 
                />
              </form>
            </div>

            {/* Cart Items */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-bold dark:text-white flex items-center gap-2 uppercase text-xs tracking-widest">
                  <FiShoppingCart className="text-emerald-500" /> Keranjang Belanja
                </h3>
                <span className="bg-emerald-500 text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-tighter">
                  {cart.length} Produk
                </span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300 dark:text-slate-600">
                    <FiPackage size={80} className="mb-4 opacity-10" />
                    <p className="font-bold italic uppercase text-xs tracking-widest">Belum ada item ditambahkan</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.code} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-5 rounded-[1.5rem] border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all group">
                      <div className="flex-1 mb-4 md:mb-0">
                        <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {item.code} • @Rp {Number(item.price).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-1 shadow-sm">
                          <button onClick={() => updateQuantity(item.code, -1)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><FiMinus size={14}/></button>
                          <span className="w-10 text-center font-black dark:text-white text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.code, 1)} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"><FiPlus size={14}/></button>
                        </div>
                        
                        <div className="text-right min-w-[100px]">
                           <p className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                             Rp {(Number(item.price) * item.quantity).toLocaleString()}
                           </p>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.code)} className="p-2 text-slate-300 hover:text-red-500 transition-all">
                          <FiTrash2 size={20}/>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl sticky top-24 border border-slate-200 dark:border-slate-700">
              <h3 className="font-black mb-8 dark:text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                <FiAlertCircle className="text-indigo-500" /> Ringkasan Pembayaran
              </h3>
              
              <div className="grid grid-cols-3 gap-2 mb-8 text-[9px] font-black uppercase">
                {[
                  { id: 'cash', icon: <FiCreditCard size={18} />, label: 'Tunai' },
                  { id: 'wallet', icon: <FiSmartphone size={18} />, label: 'E-Wallet' },
                  { id: 'bank', icon: <FiHome size={18} />, label: 'Bank' },
                ].map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => setPaymentMethod(m.id)} 
                    className={`flex flex-col items-center py-5 rounded-2xl border-2 transition-all active:scale-95 ${paymentMethod === m.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'border-slate-50 dark:border-slate-700 text-slate-400'}`}
                  >
                    {m.icon} <span className="mt-2">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl text-center border border-slate-200 dark:border-slate-700 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                  <p className="text-4xl font-black dark:text-white tracking-tighter">
                    <span className="text-lg mr-1 text-emerald-500">Rp</span>
                    {totalPrice.toLocaleString()}
                  </p>
                </div>

                {/* Conditional Inputs */}
                {paymentMethod === 'cash' && (
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Uang Tunai Diterima</label>
                    <input 
                      type="number" 
                      className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-black text-center text-2xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-inner" 
                      placeholder="0" 
                      value={cashReceived} 
                      onChange={(e) => setCashReceived(e.target.value)} 
                    />
                    {cashReceived && (
                       <div className={`p-5 rounded-2xl flex justify-between items-center font-black ${change < 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                          <span className="text-[10px] uppercase">Kembalian</span>
                          <span className="text-lg">Rp {Math.max(0, change).toLocaleString()}</span>
                       </div>
                    )}
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nomor HP Customer</label>
                    <input 
                      type="text" 
                      className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-black text-center outline-none border-2 border-transparent focus:border-indigo-500" 
                      placeholder="08xx..." 
                      value={walletNumber} 
                      onChange={(e) => setWalletNumber(e.target.value)} 
                    />
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-center">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Tujuan Transfer</p>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border dark:border-slate-700">
                      <p className="text-xs font-black dark:text-white mb-3">{bankAccount}</p>
                      <button 
                        onClick={() => copyToClipboard(bankAccount)} 
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-blue-50 text-blue-600'}`}
                      >
                        {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Tersalin' : 'Salin Rekening'}
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleCheckout} 
                  disabled={cart.length === 0} 
                  className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest mt-4"
                >
                  <FiPrinter size={20} /> Konfirmasi & Cetak
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL STRUK */}
      {showReceipt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[3rem] shadow-2xl p-8 border border-white/10 relative">
            <button onClick={resetTransaction} className="absolute top-6 right-6 text-slate-400 hover:text-red-500"><FiX size={24}/></button>
            
            <div id="printable-receipt" className="bg-white p-8 font-mono text-slate-800 border-2 border-slate-100 rounded-[2.5rem] text-[10px]">
              <div className="text-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">WARUNG DIGITAL</h2>
                <p className="text-[8px] opacity-60 mt-1 uppercase">Struk Pembayaran Sah</p>
                <div className="border-b border-dashed my-4 border-slate-300"></div>
              </div>
              
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between"><span>TID:</span> <span className="font-bold">{transactionId}</span></div>
                <div className="flex justify-between"><span>TGL:</span> <span>{new Date().toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span>METODE:</span> <span className="uppercase font-bold">{paymentMethod}</span></div>
              </div>
              
              <div className="border-b border-dashed my-4 border-slate-300"></div>
              
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.code} className="flex flex-col">
                    <div className="flex justify-between font-bold uppercase">
                      <span>{item.name}</span>
                      <span>{(Number(item.price) * item.quantity).toLocaleString()}</span>
                    </div>
                    <span className="opacity-60 text-[9px]">{item.quantity} x @{Number(item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-b border-dashed my-4 border-slate-300"></div>
              
              <div className="flex justify-between font-black text-base pt-2">
                <span>TOTAL</span>
                <span>Rp {totalPrice.toLocaleString()}</span>
              </div>
              
              {paymentMethod === 'cash' && (
                <div className="space-y-1 mt-2 opacity-80 text-[9px]">
                  <div className="flex justify-between"><span>BAYAR:</span> <span>Rp {parseInt(cashReceived).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>KEMBALI:</span> <span>Rp {change.toLocaleString()}</span></div>
                </div>
              )}

              <div className="text-center mt-10 italic opacity-40 text-[7px] uppercase tracking-[0.3em]">
                <p>Terima kasih atas kunjungannya</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button onClick={() => window.print()} className="py-5 bg-slate-100 dark:bg-slate-700 dark:text-white font-black text-[10px] rounded-2xl flex items-center justify-center gap-2 uppercase">
                <FiPrinter size={16}/> Cetak
              </button>
              <button onClick={resetTransaction} className="py-5 bg-emerald-500 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-emerald-500/20 uppercase">
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionPage;
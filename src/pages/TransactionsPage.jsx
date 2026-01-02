import React, { useState, useRef } from "react"; 
import { 
  FiTrash2, FiPlus, FiMinus, FiPrinter, FiSearch, 
  FiCreditCard, FiSmartphone, FiHome, FiCopy,
  FiPackage, FiCheckCircle, FiShoppingCart, FiX 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import useCart from "../hooks/useCart";
import useKeyboard from "../hooks/useKeyboard";

function TransactionPage() {
  // Ambil data produk dari localStorage untuk referensi stok & pencarian
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("warung_products");
    return saved ? JSON.parse(saved) : [];
  });

  const { cart, addItem, removeItem, clearCart, totalQty, totalPrice } = useCart();

  const [searchCode, setSearchCode] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  
  const searchInputRef = useRef(null);

  const warungInfo = {
    name: localStorage.getItem("warung_name") || "Warung Digital",
    phone: localStorage.getItem("warung_user_phone") || "08123456789",
    bank: localStorage.getItem("warung_user_bank") || "BCA - 12345678",
  };

  const change = (paymentMethod === "cash" && cashReceived) ? parseInt(cashReceived) - totalPrice : 0;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = (e) => {
    if(e) e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    if (!cleanCode) return;

    const product = products.find(p => p.code === cleanCode);
    
    if (!product) {
      alert("❌ Produk tidak ditemukan!");
    } else if (Number(product.stock) <= 0) {
      alert("⚠️ Stok habis!");
    } else {
      // Mengirim objek lengkap agar useCart bisa validasi stok
      addItem(product);
    }
    setSearchCode("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === "cash" && (parseInt(cashReceived) < totalPrice || !cashReceived)) {
      alert("⚠️ Uang tunai kurang!");
      return;
    }

    const tid = `WD-${Date.now().toString().slice(-8)}`;
    setTransactionId(tid);

    // Update stok produk di localStorage
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.code === p.code);
      if (cartItem) return { ...p, stock: Number(p.stock) - cartItem.qty };
      return p;
    });
    
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    // Simpan data transaksi ke history
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
    clearCart();
    setCashReceived("");
    setShowReceipt(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  useKeyboard({
    onPay: handleCheckout,
    onFocusSearch: () => searchInputRef.current?.focus(),
    onClear: () => { 
      if (window.confirm("Kosongkan keranjang?")) { 
        clearCart(); 
      } 
    }
  });

  return (
    /* pt-24 memastikan konten tidak tertutup navbar atas, pb-32 memberikan ruang untuk menu bawah HP */
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-32 md:pb-10 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black dark:text-white uppercase flex items-center gap-3 justify-center md:justify-start">
              <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                <FiShoppingCart size={22} />
              </div> 
              POS Kasir
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{warungInfo.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* KOLOM KIRI (MOBILE ATAS) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Form Pencarian */}
            <div className="bg-white dark:bg-[#0f172a] p-2 rounded-3xl border-2 border-emerald-500/30 shadow-sm focus-within:border-emerald-500 transition-all">
              <form onSubmit={handleAddToCart} className="relative flex items-center">
                <FiSearch className="absolute left-5 text-slate-400" size={20} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="w-full pl-14 pr-6 py-4 bg-transparent dark:text-white font-black outline-none text-lg placeholder:text-slate-300 dark:placeholder:text-slate-600" 
                  placeholder="Scan Barcode / Kode..." 
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                />
              </form>
            </div>

            {/* List Barang */}
            <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] md:rounded-[2.5rem] shadow-sm border dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col">
              <div className="p-5 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="font-black dark:text-white text-[10px] uppercase flex items-center gap-2 tracking-widest">
                  <FiPackage className="text-emerald-500" /> Item Terpilih ({totalQty})
                </h3>
                <button onClick={() => { if(window.confirm("Hapus semua?")) clearCart() }} className="text-[10px] font-black text-red-500 uppercase hover:underline">Hapus Semua</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 dark:text-white py-20 text-center">
                    <FiShoppingCart size={64} className="mx-auto" />
                    <p className="text-xs font-black mt-4 uppercase tracking-widest">Keranjang Masih Kosong</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={item.code} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border dark:border-slate-700/50 gap-4"
                    >
                      <div className="flex-1">
                        <p className="font-black text-slate-800 dark:text-white uppercase text-xs truncate">{item.name}</p>
                        <p className="text-[10px] text-emerald-500 font-bold">Rp {Number(item.price).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8">
                        <div className="flex items-center bg-white dark:bg-[#020617] rounded-2xl p-1 shadow-inner border dark:border-slate-700">
                          <button onClick={() => addItem({...item, qty: -1})} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500"><FiMinus size={14}/></button>
                          <span className="w-8 text-center font-black dark:text-white text-sm">{item.qty}</span>
                          <button onClick={() => addItem(item)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-emerald-500"><FiPlus size={14}/></button>
                        </div>
                        <div className="text-right min-w-[90px]">
                          <p className="font-black dark:text-white text-sm">Rp {(item.price * item.qty).toLocaleString()}</p>
                        </div>
                        <button onClick={() => removeItem(item.code)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <FiTrash2 size={18}/>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (RINGKASAN & BAYAR) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#0f172a] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border dark:border-slate-800 sticky top-24">
              <div className="bg-slate-900 dark:bg-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center mb-6 shadow-2xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Total Tagihan</p>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  <span className="text-lg text-emerald-500 mr-2 font-medium">Rp</span>{totalPrice.toLocaleString()}
                </p>
              </div>

              {/* Metode Pembayaran */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'cash', icon: <FiCreditCard />, label: 'Tunai' },
                  { id: 'qris', icon: <FiSmartphone />, label: 'QRIS' },
                  { id: 'bank', icon: <FiHome />, label: 'Bank' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${paymentMethod === m.id ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-slate-50 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <span className="text-2xl mb-2">{m.icon}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Detail Pembayaran (QRIS/Bank) */}
              {paymentMethod !== 'cash' && (
                <div className="mb-6 p-5 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      {paymentMethod === 'qris' ? 'Data QRIS' : 'Nomor Rekening'}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(paymentMethod === 'qris' ? warungInfo.phone : warungInfo.bank)}
                      className="text-[9px] font-black uppercase text-emerald-600 flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm"
                    >
                      {copied ? <><FiCheckCircle/> Tersalin</> : <><FiCopy/> Salin</>}
                    </button>
                  </div>
                  <p className="font-mono text-lg font-bold dark:text-white truncate">
                    {paymentMethod === 'qris' ? warungInfo.phone : warungInfo.bank}
                  </p>
                </div>
              )}

              {/* Input Tunai & Kembalian */}
              {paymentMethod === 'cash' && (
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">Rp</span>
                    <input 
                      type="number" 
                      className="w-full pl-16 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black text-2xl outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-right" 
                      placeholder="Uang Tunai..."
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                    />
                  </div>
                  {cashReceived && (
                    <div className="flex justify-between items-center p-5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
                      <span className="text-[10px] font-black uppercase tracking-widest">Kembalian</span>
                      <span className="text-xl font-black">Rp {change >= 0 ? change.toLocaleString() : 0}</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-black rounded-[1.5rem] shadow-xl shadow-emerald-500/20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95"
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
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
            >
              <button onClick={() => setShowReceipt(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black">
                <FiX size={24} />
              </button>

              <div className="text-center font-mono text-slate-800 pt-4">
                <FiCheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase mb-1 tracking-tighter">{warungInfo.name}</h2>
                <p className="text-[10px] opacity-60 mb-6">#{transactionId} • {new Date().toLocaleString('id-ID')}</p>
                
                <div className="border-b border-dashed border-slate-300 mb-6"></div>
                
                <div className="max-h-[250px] overflow-y-auto space-y-3 mb-8 text-left text-[11px]">
                  {cart.map(item => (
                    <div key={item.code} className="flex justify-between items-start">
                      <span className="uppercase flex-1 pr-4">{item.name} <br/> <span className="opacity-50 font-sans">{item.qty} x {item.price.toLocaleString()}</span></span>
                      <span className="font-bold">{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-slate-900 pt-4 mb-2 flex justify-between font-black text-xl">
                  <span>TOTAL</span>
                  <span>Rp {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[10px] font-sans italic opacity-40 mt-4 text-center">Simpan struk ini sebagai bukti pembayaran sah.</p>
              </div>

              <button 
                onClick={resetTransaction} 
                className="w-full mt-8 py-5 bg-slate-900 hover:bg-black text-white font-black rounded-2xl uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-900/20"
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
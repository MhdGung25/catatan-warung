import React, { useState, useEffect, useRef } from "react";
import { 
  FiShoppingCart, FiTrash2, FiMaximize, FiCreditCard, 
  FiDollarSign, FiPrinter, FiX, FiAlertCircle, FiPlus, FiHash,
  FiActivity, FiPackage, FiZap, FiCamera
} from "react-icons/fi";
import { Html5Qrcode } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

// --- KOMPONEN SCANNER ---
const ScannerModal = ({ onResult, onClose }) => {
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };

    html5QrCode.start(
      { facingMode: "environment" }, 
      config, 
      (decodedText) => {
        onResult(decodedText);
        stopScanner();
      },
      () => {} 
    ).then(() => {
      setIsCameraReady(true);
    }).catch((err) => {
      console.error("Gagal akses kamera:", err);
      alert("Akses kamera ditolak atau tidak didukung.");
    });

    const stopScanner = () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear());
      }
    };

    return () => stopScanner();
  }, [onResult]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
    >
      <div className="relative w-full max-w-md bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
        <div className="p-6 flex justify-between items-center border-b border-white/5">
           <h3 className="text-white font-black text-xs uppercase tracking-widest">Scanner Aktif</h3>
           <button onClick={onClose} className="text-white/50 hover:text-white"><FiX size={24} /></button>
        </div>
        <div className="relative aspect-square bg-black">
          <div id="reader" className="w-full h-full"></div>
          {!isCameraReady && <div className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px] font-black uppercase">Menghubungkan...</div>}
          <div className="absolute inset-0 border-[40px] border-slate-900/40 pointer-events-none"></div>
        </div>
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4 text-indigo-500 animate-pulse"><FiMaximize size={32} /></div>
          <p className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Scan Barcode / QR Produk</p>
        </div>
      </div>
    </motion.div>
  );
};

function TransactionsPage() {
  const inputRef = useRef(null); // Digunakan untuk auto-focus setelah tambah barang
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("warung_cart") || "[]"));
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("warung_transactions") || "[]"));
  const [isScanning, setIsScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");
  const [currentInput, setCurrentInput] = useState({ code: "", product: "", qty: 1, price: 0 });

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { localStorage.setItem("warung_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("warung_transactions", JSON.stringify(transactions)); }, [transactions]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCodeChange = (val) => {
    setCurrentInput(prev => ({ ...prev, code: val }));
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const found = savedProducts.find(p => p.code === val.trim());
    if (found) {
      setCurrentInput({ code: found.code, product: found.name, price: found.price, qty: 1 });
      setError("");
    }
  };

  const addToCart = (e) => {
    if(e) e.preventDefault();
    if (!currentInput.product) { setError("Produk tidak ditemukan!"); return; }
    
    const masterProduk = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const itemInGudang = masterProduk.find(p => p.code === currentInput.code);
    
    if (!itemInGudang || itemInGudang.stock < currentInput.qty) {
      setError("Stok tidak mencukupi!");
      return;
    }

    const newItem = { ...currentInput, id: Date.now(), subtotal: currentInput.price * currentInput.qty };
    setCart([...cart, newItem]);
    setCurrentInput({ code: "", product: "", qty: 1, price: 0 });
    setError("");
    inputRef.current?.focus(); // Panggil ref di sini
  };

  const finalizeTransaction = () => {
    if (cart.length === 0) return;
    const masterProduk = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const updatedMasterProduk = masterProduk.map(produk => {
      const itemDibeli = cart.find(item => item.code === produk.code);
      return itemDibeli ? { ...produk, stock: produk.stock - itemDibeli.qty } : produk;
    });
    
    localStorage.setItem("warung_products", JSON.stringify(updatedMasterProduk));
    
    const newTransaction = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      items: cart, total: cartTotal, method: paymentMethod,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('id-ID')
    };
    
    setTransactions([newTransaction, ...transactions]);
    setCart([]);
    alert("Berhasil!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-4 pt-24 pb-[400px] transition-colors duration-500">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-black dark:text-white tracking-tighter uppercase italic">Kasir</h1>
        <button onClick={() => setIsScanning(true)} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-3">
          <FiCamera size={20} /> <span className="font-black text-[10px] uppercase tracking-widest">Scanner</span>
        </button>
      </div>

      <AnimatePresence>
        {isScanning && <ScannerModal onResult={(res) => { handleCodeChange(res); setIsScanning(false); }} onClose={() => setIsScanning(false)} />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT AREA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
            <h3 className="font-black text-xs dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2"><FiPlus className="text-indigo-500" /> Tambah Barang</h3>
            <form onSubmit={addToCart} className="space-y-4">
              <div className="relative">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input ref={inputRef} className="w-full bg-slate-50 dark:bg-slate-800 p-4 pl-12 rounded-2xl dark:text-white font-bold outline-none" placeholder="Kode Barcode" value={currentInput.code} onChange={(e) => handleCodeChange(e.target.value)} />
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-[9px] font-black text-slate-400 uppercase">Nama Barang</p>
                <h2 className="text-sm font-black dark:text-white truncate">{currentInput.product || "-"}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl dark:text-white font-black text-center" value={currentInput.qty} onChange={(e) => setCurrentInput({...currentInput, qty: parseInt(e.target.value) || 1})} />
                <button type="submit" className="bg-indigo-600 text-white font-black text-[10px] uppercase rounded-2xl">Tambah</button>
              </div>
              {error && <div className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-black uppercase"><FiAlertCircle /> {error}</div>}
            </form>
          </div>
        </div>

        {/* CART & HISTORY AREA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-black text-[10px] dark:text-white uppercase tracking-widest flex items-center gap-2"><FiShoppingCart className="text-indigo-500" /> Keranjang</h3>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
              {cart.length === 0 ? <div className="py-20 text-center text-slate-300"><FiPackage size={40} className="mx-auto mb-2 opacity-20" /><p className="text-[10px] font-black uppercase">Kosong</p></div> : 
                cart.map(item => (
                  <div key={item.id} className="p-5 flex items-center justify-between border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <div><p className="font-black text-xs dark:text-white uppercase leading-none">{item.product}</p><p className="text-[9px] text-slate-400 mt-1">x{item.qty} • Rp {item.price.toLocaleString()}</p></div>
                    <div className="flex items-center gap-4"><p className="font-black text-xs text-indigo-600">Rp {item.subtotal.toLocaleString()}</p><button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-400 p-2"><FiTrash2 size={16}/></button></div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
             <div className="p-6 border-b dark:border-slate-800 flex items-center gap-2"><FiActivity className="text-emerald-500" /><h3 className="font-black text-[10px] dark:text-white uppercase tracking-widest">Riwayat Hari Ini</h3></div>
             <div className="max-h-[200px] overflow-y-auto">
                {transactions.map(trx => (
                  <div key={trx.id} className="p-5 flex items-center justify-between border-b dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-3"><FiZap className="text-amber-500" /><div><p className="font-black text-[10px] dark:text-white leading-none">{trx.id}</p><p className="text-[8px] text-slate-400 uppercase mt-1">{trx.time} • {trx.method}</p></div></div>
                    <div className="flex items-center gap-3"><p className="font-black text-xs dark:text-white">Rp {trx.total.toLocaleString()}</p><button className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg"><FiPrinter size={14}/></button></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* FOOTER TOTAL */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-28 left-4 right-4 max-w-4xl mx-auto z-[100]">
         <div className="bg-slate-900 dark:bg-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10 dark:border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-widest">Total Bayar</p>
              <h2 className="text-3xl font-black text-white dark:text-slate-900 tracking-tighter">Rp {cartTotal.toLocaleString()}</h2>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <div className="flex bg-white/5 dark:bg-slate-100 p-1.5 rounded-2xl flex-1">
                  <button onClick={() => setPaymentMethod("Cash")} className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black transition-all flex items-center justify-center gap-2 ${paymentMethod === "Cash" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><FiDollarSign /> TUNAI</button>
                  <button onClick={() => setPaymentMethod("Digital")} className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black transition-all flex items-center justify-center gap-2 ${paymentMethod === "Digital" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}><FiCreditCard /> QRIS</button>
               </div>
               <button onClick={finalizeTransaction} disabled={cart.length === 0} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 ${cart.length > 0 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>Bayar</button>
            </div>
         </div>
      </motion.div>
    </div>
  );
}

export default TransactionsPage;
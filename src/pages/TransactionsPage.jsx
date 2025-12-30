import React, { useState, useEffect, useRef } from "react";
import { 
  FiShoppingCart, FiTrash2, FiMaximize, FiCreditCard, 
  FiDollarSign, FiPrinter, FiX, FiAlertCircle, FiPlus, FiHash,
  FiActivity, FiPackage, FiZap
} from "react-icons/fi";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";

const ScannerModal = ({ onResult, onClose }) => {
  useEffect(() => {
    const config = {
      fps: 25,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      videoConstraints: { facingMode: "environment" },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.QR_CODE
      ]
    };
    const scanner = new Html5QrcodeScanner("reader", config, false);
    scanner.render((text) => onResult(text), () => {});
    return () => { scanner.clear().catch(e => console.error(e)); };
  }, [onResult]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
        <div id="reader" className="w-full"></div>
        <button onClick={onClose} className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full z-20 active:scale-90"><FiX size={20} /></button>
        <div className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Arahkan kamera ke Barcode</div>
      </div>
    </motion.div>
  );
};

function TransactionsPage() {
  const inputRef = useRef(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("warung_cart") || "[]"));
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem("warung_transactions") || "[]"));
  const [isScanning, setIsScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");
  const [currentInput, setCurrentInput] = useState({ code: "", product: "", qty: 1, price: 0 });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  useEffect(() => { localStorage.setItem("warung_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("warung_transactions", JSON.stringify(transactions)); }, [transactions]);

  const getProductFromStorage = (codeOrName) => {
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const term = codeOrName.toString().toLowerCase().trim();
    return savedProducts.find(p => p.code === term || p.name.toLowerCase() === term);
  };

  const handleCodeChange = (val) => {
    setCurrentInput(prev => ({ ...prev, code: val }));
    const found = getProductFromStorage(val);
    if (found) {
      setCurrentInput({ code: found.code, product: found.name, price: found.price, qty: 1 });
      setError("");
    }
  };

  const handleScanResult = (decodedText) => {
    const found = getProductFromStorage(decodedText);
    if (found) {
      setCurrentInput({ code: found.code, product: found.name, price: found.price, qty: 1 });
      setIsScanning(false);
      setError("");
    } else {
      setError(`Produk "${decodedText}" tidak ditemukan.`);
      setIsScanning(false);
    }
  };

  const addToCart = (e) => {
    if(e) e.preventDefault();
    if (!currentInput.product) { setError("Pilih produk!"); return; }
    const masterProduk = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const itemInGudang = masterProduk.find(p => p.code === currentInput.code);
    if (!itemInGudang || itemInGudang.stock < currentInput.qty) {
      setError(`Stok kurang! Tersedia: ${itemInGudang ? itemInGudang.stock : 0}`);
      return;
    }
    const newItem = { ...currentInput, id: Date.now(), subtotal: currentInput.price * currentInput.qty };
    setCart([...cart, newItem]);
    setCurrentInput({ code: "", product: "", qty: 1, price: 0 });
    setError("");
    inputRef.current?.focus();
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
      items: cart,
      total: cartTotal,
      method: paymentMethod,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('id-ID')
    };
    setTransactions([newTransaction, ...transactions]);
    setCart([]);
    alert("Transaksi Berhasil!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] p-4 md:p-10 pt-28 md:pt-10 pb-96 md:pb-48 transition-colors duration-500">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Terminal Kasir</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Sistem Aktif</p>
        </div>
        <button onClick={() => setIsScanning(true)} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"><FiMaximize size={18} /> BUKA SCANNER</button>
      </header>

      <AnimatePresence>{isScanning && <ScannerModal onResult={handleScanResult} onClose={() => setIsScanning(false)} />}</AnimatePresence>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANEL */}
        <section className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="font-black text-sm dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2"><FiPlus className="text-indigo-500" /> Input Item</h3>
            <form onSubmit={addToCart} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kode Produk</label>
                <div className="relative"><FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" /><input ref={inputRef} placeholder="Scan / Ketik..." className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-indigo-500/30 transition-all text-sm" value={currentInput.code} onChange={(e) => handleCodeChange(e.target.value)} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama</label>
                <div className="w-full px-5 py-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 text-slate-500 font-bold text-sm truncate">{currentInput.product || "Menunggu..."}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Qty</label>
                  <input type="number" min="1" className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black border-2 border-transparent focus:border-indigo-500/30 text-sm outline-none" value={currentInput.qty} onChange={(e) => setCurrentInput({...currentInput, qty: parseInt(e.target.value) || 1})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Harga</label>
                  <div className="w-full py-4 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-lg shadow-emerald-500/20">Rp {currentInput.price.toLocaleString()}</div>
                </div>
              </div>
              {error && <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase italic"><FiAlertCircle /> {error}</div>}
              <button type="submit" className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all active:scale-95">Tambah Ke Keranjang</button>
            </form>
          </div>
        </section>

        {/* LIST & HISTORY */}
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
              <h3 className="font-black text-sm dark:text-white uppercase tracking-widest flex items-center gap-2"><FiShoppingCart className="text-indigo-500" /> Keranjang</h3>
              {cart.length > 0 && <button onClick={() => setCart([])} className="text-[9px] font-black text-red-500 uppercase px-3 py-1 hover:bg-red-50 rounded-lg">Reset</button>}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? <div className="py-20 text-center"><FiPackage className="mx-auto text-slate-100 dark:text-slate-800 mb-4" size={48}/><p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">Kosong</p></div> : (
                <table className="w-full text-left">
                  <tbody className="divide-y dark:divide-slate-800 font-bold dark:text-white">
                    {cart.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="p-5 truncate max-w-[150px]"><span className="block font-black text-xs uppercase leading-tight">{item.product}</span><span className="text-[9px] text-slate-400 font-mono italic">#{item.code}</span></td>
                        <td className="p-3 text-center"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black">x{item.qty}</span></td>
                        <td className="p-3 text-right"><span className="text-xs font-black text-indigo-600">Rp {item.subtotal.toLocaleString()}</span></td>
                        <td className="p-5 text-right"><button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800 flex items-center gap-2"><FiActivity className="text-emerald-500" /><h3 className="font-black text-sm dark:text-white uppercase tracking-widest">Riwayat</h3></div>
            <div className="max-h-[200px] overflow-y-auto divide-y dark:divide-slate-800">
              {transactions.length === 0 ? <div className="p-10 text-center text-slate-300 text-[9px] font-black uppercase tracking-widest">Belum ada riwayat</div> : transactions.map(trx => (
                  <div key={trx.id} className="flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600"><FiZap size={16} /></div>
                      <div><p className="font-black dark:text-white text-[11px] leading-tight">{trx.id}</p><p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{trx.time} • {trx.method}</p></div>
                    </div>
                    <div className="flex items-center gap-4"><span className="font-black text-slate-900 dark:text-white text-xs">Rp {trx.total.toLocaleString()}</span><button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><FiPrinter size={16} /></button></div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* FLOATING PAYMENT PANEL (DI ATAS BOTTOM NAV) */}
      <motion.div initial={{ y: 150 }} animate={{ y: 0 }} className="fixed bottom-28 md:bottom-8 left-4 right-4 max-w-7xl mx-auto z-[120]">
        <div className="bg-slate-900 dark:bg-white p-5 md:p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex h-12 w-12 bg-white/10 dark:bg-slate-100 rounded-2xl items-center justify-center text-white dark:text-slate-900"><FiShoppingCart size={22} /></div>
            <div className="text-center md:text-left">
              <p className="text-slate-400 dark:text-slate-500 font-black text-[8px] uppercase tracking-widest mb-1">Total Bayar</p>
              <h2 className="text-2xl md:text-3xl font-black text-white dark:text-slate-900 tracking-tighter"><span className="text-indigo-400 dark:text-indigo-600 mr-1">Rp</span> {cartTotal.toLocaleString('id-ID')}</h2>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white/5 dark:bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto">
              <button onClick={() => setPaymentMethod("Cash")} className={`flex-1 sm:w-28 py-3 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${paymentMethod === "Cash" ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500'}`}><FiDollarSign size={14} /> TUNAI</button>
              <button onClick={() => setPaymentMethod("Digital")} className={`flex-1 sm:w-28 py-3 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${paymentMethod === "Digital" ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}><FiCreditCard size={14} /> DIGITAL</button>
            </div>
            <button onClick={finalizeTransaction} disabled={cart.length === 0} className={`w-full sm:w-48 py-4 rounded-xl font-black tracking-widest text-[10px] uppercase shadow-lg transition-all active:scale-95 ${cart.length > 0 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}>Simpan Transaksi</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TransactionsPage;
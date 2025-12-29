import React, { useState, useEffect } from "react";
import { 
  FiShoppingCart, FiTrash2, FiMaximize, FiCreditCard, 
  FiDollarSign, FiPrinter, FiX, FiAlertCircle, FiPlus, FiHash,
  FiActivity 
} from "react-icons/fi";
import { Html5QrcodeScanner } from "html5-qrcode";

function TransactionsPage() {
  // 1. STATE MANAGEMENT DENGAN INITIAL LOAD DARI LOCALSTORAGE
  // Inisialisasi langsung dari localStorage agar data tidak hilang saat refresh
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("warung_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTrx = localStorage.getItem("warung_transactions");
    return savedTrx ? JSON.parse(savedTrx) : [];
  });

  const [isScanning, setIsScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [error, setError] = useState("");
  const [currentInput, setCurrentInput] = useState({ 
    code: "", product: "", qty: 1, price: 0 
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 2. AUTO-SAVE KE LOCALSTORAGE
  // Menjaga data tetap ada meskipun pindah halaman atau restart browser
  useEffect(() => {
    localStorage.setItem("warung_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("warung_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // 3. AMBIL DATA PRODUK DARI GUDANG (Sinkron dengan ProductsPage)
  const getProductFromStorage = (codeOrName) => {
    const savedProducts = JSON.parse(localStorage.getItem("warung_products") || "[]");
    const term = codeOrName.toLowerCase().trim();
    return savedProducts.find(p => 
      p.code === codeOrName || p.name.toLowerCase() === term
    );
  };

  // 4. LOGIKA SCANNER (Hanya muncul jika tombol diklik)
  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render((decodedText) => {
        const found = getProductFromStorage(decodedText);
        if (found) {
          setCurrentInput({
            code: found.code,
            product: found.name,
            price: found.price,
            qty: 1
          });
          setIsScanning(false);
          scanner.clear();
          setError("");
        } else {
          setError(`Kode ${decodedText} tidak ditemukan di gudang!`);
        }
      }, () => {});
    }
    return () => { if (scanner) scanner.clear().catch(e => console.error(e)); };
  }, [isScanning]);

  // 5. AUTO-FILL SAAT KETIK MANUAL
  useEffect(() => {
    if (currentInput.code || currentInput.product) {
      const found = getProductFromStorage(currentInput.code || currentInput.product);
      if (found) {
        setCurrentInput(prev => ({ 
          ...prev, 
          product: found.name, 
          code: found.code, 
          price: found.price 
        }));
      }
    }
  }, [currentInput.code, currentInput.product]);

  const addToCart = (e) => {
    e.preventDefault();
    if (!currentInput.product || currentInput.price <= 0) {
      setError("Produk tidak valid!");
      return;
    }
    const newItem = {
      ...currentInput,
      id: Date.now(),
      subtotal: currentInput.price * currentInput.qty
    };
    setCart([...cart, newItem]);
    setCurrentInput({ code: "", product: "", qty: 1, price: 0 });
    setError("");
  };

  const finalizeTransaction = () => {
    if (cart.length === 0) return;
    const newTransaction = {
      id: `TRX-${Date.now()}`,
      items: cart,
      total: cartTotal,
      method: paymentMethod,
      time: new Date().toLocaleTimeString('id-ID'),
      date: new Date().toLocaleDateString('id-ID')
    };
    setTransactions([newTransaction, ...transactions]);
    setCart([]);
    alert("Transaksi Berhasil Disimpan!");
  };

  const handlePrint = (trx) => {
    const printWindow = window.open('', '_blank', 'width=400');
    printWindow.document.write(`
      <html>
        <body style="font-family: monospace; padding: 20px; font-size: 12px;">
          <center><h2>WARUNG DIGITAL</h2><p>----------------------------</p></center>
          <p>ID: ${trx.id}<br>${trx.date} ${trx.time}</p>
          <hr>
          <table width="100%">
            ${trx.items.map(item => `
              <tr>
                <td>${item.product}<br>${item.qty} x ${item.price.toLocaleString()}</td>
                <td align="right">${item.subtotal.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
          <hr>
          <table width="100%" style="font-weight:bold">
            <tr><td>TOTAL</td><td align="right">Rp ${trx.total.toLocaleString()}</td></tr>
            <tr><td>METODE</td><td align="right">${trx.method}</td></tr>
          </table>
          <center><p><br>TERIMA KASIH</p></center>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-900 transition-all">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Terminal Kasir</h1>
          <p className="text-emerald-500 font-bold text-xs uppercase tracking-widest">Transaksi Aktif</p>
        </div>
        <button 
          onClick={() => setIsScanning(!isScanning)} 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg active:scale-95 transition-all"
        >
          {isScanning ? <FiX /> : <FiMaximize />} {isScanning ? "TUTUP SCANNER" : "SCAN BARCODE"}
        </button>
      </div>

      {/* Area Scanner (Hanya muncul saat tombol scan diklik) */}
      {isScanning && (
        <div className="mb-6 overflow-hidden rounded-3xl border-4 border-indigo-600 bg-black max-w-md mx-auto shadow-2xl">
          <div id="reader"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* KOLOM KIRI: INPUT & PEMBAYARAN */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-black mb-4 flex items-center gap-2 dark:text-white">
              <FiPlus className="text-emerald-500" /> Input Pesanan
            </h3>
            
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-[11px] font-black border border-red-100">
                <FiAlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={addToCart} className="space-y-3">
              <div className="relative">
                <FiHash className="absolute left-4 top-4 text-slate-400" />
                <input 
                  placeholder="Kode atau Barcode" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                  value={currentInput.code}
                  onChange={(e) => setCurrentInput({...currentInput, code: e.target.value})}
                />
              </div>
              <input 
                placeholder="Nama Produk" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-indigo-500"
                value={currentInput.product}
                onChange={(e) => setCurrentInput({...currentInput, product: e.target.value})}
              />
              <div className="flex gap-2">
                <input 
                  type="number" placeholder="Qty" min="1"
                  className="w-1/3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-indigo-500"
                  value={currentInput.qty}
                  onChange={(e) => setCurrentInput({...currentInput, qty: parseInt(e.target.value) || 1})}
                />
                <div className="w-2/3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 font-black flex items-center justify-between">
                  <span className="text-[10px] uppercase">Harga</span>
                  <span className="dark:text-emerald-400 font-bold">Rp {currentInput.price.toLocaleString()}</span>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">
                TAMBAHKAN
              </button>
            </form>
          </div>

          <div className="bg-indigo-900 text-white p-7 rounded-[32px] shadow-2xl">
            <p className="text-indigo-300 font-bold text-[10px] uppercase mb-1">Total Tagihan</p>
            <h2 className="text-4xl font-black mb-6">Rp {cartTotal.toLocaleString('id-ID')}</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setPaymentMethod("Cash")}
                className={`py-3 rounded-xl text-[10px] font-black border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === "Cash" ? 'bg-white text-indigo-900 border-white' : 'border-indigo-700 text-indigo-300'}`}
              >
                <FiDollarSign size={14}/> TUNAI
              </button>
              <button 
                onClick={() => setPaymentMethod("Digital")}
                className={`py-3 rounded-xl text-[10px] font-black border-2 flex items-center justify-center gap-2 transition-all ${paymentMethod === "Digital" ? 'bg-white text-indigo-900 border-white' : 'border-indigo-700 text-indigo-300'}`}
              >
                <FiCreditCard size={14}/> WALLET
              </button>
            </div>

            <button 
              onClick={finalizeTransaction}
              disabled={cart.length === 0}
              className={`w-full py-4 rounded-2xl font-black transition-all ${cart.length > 0 ? 'bg-emerald-400 text-indigo-950 hover:bg-emerald-300 shadow-lg' : 'bg-indigo-800 text-indigo-500 cursor-not-allowed'}`}
            >
              SIMPAN TRANSAKSI
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: DAFTAR BELANJA & RIWAYAT */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-black flex items-center gap-2 dark:text-white"><FiShoppingCart className="text-indigo-500"/> Keranjang Belanja</h3>
              <button onClick={() => setCart([])} className="text-[10px] font-bold text-red-500 uppercase">Hapus Semua</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-bold italic">Belum ada item</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/50">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="text-center">Qty</th>
                      <th>Subtotal</th>
                      <th className="text-right p-4">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold dark:text-white divide-y divide-slate-50 dark:divide-slate-700">
                    {cart.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          {item.product} <br/>
                          <span className="text-[10px] text-slate-400 font-mono font-normal">#{item.code}</span>
                        </td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-emerald-600 dark:text-emerald-400">Rp {item.subtotal.toLocaleString()}</td>
                        <td className="text-right p-4">
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
              <FiActivity className="text-emerald-500"/>
              <h3 className="font-black dark:text-white">Riwayat Transaksi</h3>
            </div>
            <div className="overflow-x-auto max-h-[300px]">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {transactions.map(trx => (
                    <tr key={trx.id} className="text-sm hover:bg-slate-50/50">
                      <td className="p-4">
                        <p className="font-black dark:text-white text-xs">{trx.id}</p>
                        <p className="text-[9px] text-slate-400 font-bold">{trx.date} • {trx.time}</p>
                      </td>
                      <td className="font-black text-indigo-600 dark:text-indigo-400">Rp {trx.total.toLocaleString()}</td>
                      <td className="text-right p-4">
                        <button onClick={() => handlePrint(trx)} className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white rounded-lg hover:bg-emerald-500 hover:text-white">
                          <FiPrinter size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
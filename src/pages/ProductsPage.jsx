import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiRefreshCw, FiPackage, FiMaximize, FiX, FiHash } from "react-icons/fi";
import { Html5QrcodeScanner } from "html5-qrcode";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  
  // State form input
  const [newItem, setNewItem] = useState({ code: "", name: "", price: "", stock: "" });

  // 1. Ambil data dari LocalStorage (Hanya dijalankan sekali saat mount)
  useEffect(() => {
    const savedProducts = localStorage.getItem("warung_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Jika tidak ada data, set sebagai array kosong (Tabel Kosong di awal)
      setProducts([]);
    }
    setLoading(false);
  }, []);

  // 2. Simpan ke LocalStorage setiap ada perubahan pada state 'products'
  useEffect(() => {
    // Kita cek loading agar tidak menimpa data lama dengan array kosong saat aplikasi baru start
    if (!loading) {
      localStorage.setItem("warung_products", JSON.stringify(products));
    }
  }, [products, loading]);

  // 3. Logika Scanner Barcode
  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      });

      scanner.render(
        (decodedText) => {
          setNewItem(prev => ({ ...prev, code: decodedText }));
          setIsScanning(false);
          scanner.clear();
        },
        () => {} 
      );
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error("Scanner clear error:", err));
      }
    };
  }, [isScanning]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    // Validasi input wajib isi
    if (!newItem.name || !newItem.price || !newItem.code || !newItem.stock) {
      alert("Semua kolom (Kode, Nama, Harga, dan Stok) wajib diisi!");
      return;
    }

    const newEntry = {
      id: Date.now(), // ID unik berdasarkan waktu
      code: newItem.code,
      name: newItem.name,
      price: parseInt(newItem.price),
      stock: parseInt(newItem.stock),
    };

    // Tambahkan ke state (akan otomatis tersimpan ke localStorage karena useEffect #2)
    setProducts([newEntry, ...products]);
    
    // Reset form setelah simpan
    setNewItem({ code: "", name: "", price: "", stock: "" });
    alert("Produk berhasil disimpan ke database!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus produk ini dari gudang?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  return (
    <div className="p-4 pt-24 md:pt-8 md:p-8 min-h-screen bg-slate-50/50 dark:bg-slate-900 transition-all font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B2559] dark:text-white tracking-tight">
            Gudang Produk
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
            Manajemen Inventaris Mandiri
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
          >
            {isScanning ? <FiX /> : <FiMaximize />} {isScanning ? "Batal Scan" : "Scan Barcode"}
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="flex items-center justify-center p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Area Scanner */}
      {isScanning && (
        <div className="mb-8 overflow-hidden rounded-3xl border-4 border-indigo-600 bg-black max-w-md mx-auto shadow-2xl">
          <div id="reader"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM INPUT MANUAL */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
              <FiPackage size={20} />
            </div>
            <h2 className="font-black text-slate-800 dark:text-white">Input Produk Baru</h2>
          </div>
          
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <div className="relative">
               <FiHash className="absolute left-4 top-4 text-slate-400" />
               <input
                type="text"
                placeholder="Kode Barcode (Scan/Ketik)"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold outline-none"
                value={newItem.code}
                onChange={(e) => setNewItem({...newItem, code: e.target.value})}
              />
            </div>
            <input
              type="text"
              placeholder="Nama Produk"
              className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Harga (Rp)"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold outline-none"
                value={newItem.price}
                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              />
              <input
                type="number"
                placeholder="Stok"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none font-bold"
                value={newItem.stock}
                onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <FiPlus /> SIMPAN PRODUK
            </button>
          </form>
        </div>

        {/* TABEL DATA PRODUK */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-slate-400 font-bold">Sinkronisasi gudang...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Info Produk</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Harga Jual</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Stok</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <FiPackage size={48} className="text-slate-400" />
                          <p className="text-slate-400 font-bold italic">Belum ada data produk di gudang.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono tracking-tighter">CODE: {p.code}</div>
                        </td>
                        <td className="px-6 py-4 text-center font-black text-emerald-600 dark:text-emerald-400">
                          Rp {p.price.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-4 py-1.5 rounded-xl font-black text-xs ${p.stock < 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-900 dark:text-slate-400'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            title="Hapus Produk"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Spacer untuk mobile navigation */}
      <div className="h-28 md:hidden" />
    </div>
  );
}

export default ProductsPage;
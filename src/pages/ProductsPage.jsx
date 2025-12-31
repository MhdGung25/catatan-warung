import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiPlus, FiEdit3, FiTrash2, 
  FiSearch, FiSave, FiX, 
  FiHash, FiLayers, FiDollarSign, FiRefreshCw, FiAlertCircle,
  FiBox, FiInfo
} from "react-icons/fi"; // FiTag dihapus dari sini
import { motion, AnimatePresence } from "framer-motion";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [lowStockThreshold] = useState(
    Number(localStorage.getItem("low_stock_threshold")) || 5
  );

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: "",
    stock: ""
  });

  useEffect(() => {
    const loadData = () => {
      const savedProducts = localStorage.getItem("warung_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const generateAutoCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const timestamp = Date.now().toString().slice(-4);
    return `PRD-${timestamp}${randomNum}`;
  };

  const saveToLocalStorage = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ code: generateAutoCode(), name: "", price: "", stock: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      alert("⚠️ Mohon isi semua data!");
      return;
    }

    const updatedProducts = editingProduct 
      ? products.map(p => p.code === editingProduct.code ? formData : p)
      : [formData, ...products];
    
    saveToLocalStorage(updatedProducts);
    setShowModal(false);
  };

  const handleDelete = (code) => {
    if (window.confirm("Hapus produk ini dari inventaris?")) {
      saveToLocalStorage(products.filter(p => p.code !== code));
    }
  };

  const filteredProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => Number(a.stock) - Number(b.stock));

  const totalLowStock = products.filter(p => Number(p.stock) <= lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans pt-28 pb-32 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
              <FiBox className="text-emerald-500" /> ETALASE BARANG
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Manajemen Stok & Inventaris Rak Warung
            </p>
          </motion.div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <FiPlus size={20} /> BARANG BARU
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] shadow-sm border dark:border-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <FiPackage size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produk</p>
              <p className="text-2xl font-black dark:text-white">{products.length} Jenis</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2rem] shadow-sm border dark:border-slate-800 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${totalLowStock > 0 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <FiAlertCircle size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Perlu Belanja</p>
              <p className="text-2xl font-black dark:text-white">{totalLowStock} Habis</p>
            </div>
          </div>

          <div className="relative flex items-center">
            <FiSearch className="absolute left-7 text-slate-400" size={22} />
            <input 
              type="text" 
              placeholder="Cari Barang..."
              className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white dark:bg-[#0f172a] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-sm border dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Label & Nama Barang</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Harga Satuan</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Rak</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isLow = Number(p.stock) <= lowStockThreshold;
                return (
                  <tr key={p.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-slate-400">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 dark:text-white uppercase text-sm leading-tight">{p.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">SKU: {p.code}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="font-black text-slate-700 dark:text-slate-200">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${isLow ? 'bg-red-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          {isLow ? 'Stok Kritis' : 'Tersedia'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{p.stock} Unit Tersisa</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(p)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 rounded-xl transition-all"><FiEdit3 /></button>
                        <button onClick={() => handleDelete(p.code)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="md:hidden space-y-4">
          {filteredProducts.map((p) => (
            <div key={p.code} className="bg-white dark:bg-[#0f172a] p-5 rounded-[2rem] border dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold uppercase text-xs">
                    {p.name.charAt(0)}
                   </div>
                   <div>
                    <h3 className="font-black text-slate-800 dark:text-white uppercase leading-tight text-sm">{p.name}</h3>
                    <span className="text-[8px] font-mono font-bold text-slate-400">KODE: {p.code}</span>
                   </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400"><FiEdit3 /></button>
                  <button onClick={() => handleDelete(p.code)} className="p-2 text-red-400"><FiTrash2 /></button>
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase">Harga Jual</p>
                  <p className="font-black text-sm dark:text-white">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase">Sisa Stok</p>
                  <p className={`font-black text-sm ${Number(p.stock) <= lowStockThreshold ? 'text-red-500' : 'text-emerald-500'}`}>{p.stock} Unit</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Form */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-black dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
                    <FiInfo className="text-emerald-500" /> {editingProduct ? 'Ubah Data Barang' : 'Input Barang Baru'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><FiX size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Kode Unik Barang</label>
                      {!editingProduct && (
                        <button type="button" onClick={() => setFormData({...formData, code: generateAutoCode()})} className="text-emerald-500 text-[9px] font-black flex items-center gap-1">
                          <FiRefreshCw /> ACAK ULANG
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input readOnly className="w-full pl-14 p-4 rounded-xl bg-slate-100 dark:bg-[#020617] dark:text-white font-mono font-black outline-none text-sm" value={formData.code} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase px-1">Nama Barang</label>
                    <input autoFocus type="text" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-sm uppercase" placeholder="Masukkan Nama Barang..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase px-1">Harga Satuan</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input type="number" className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase px-1">Jumlah Stok</label>
                      <div className="relative">
                        <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" className="w-full pl-10 p-4 rounded-xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500 outline-none text-sm" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-emerald-500 text-white font-black rounded-xl shadow-xl shadow-emerald-500/30 uppercase text-[10px] tracking-widest mt-4 flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <FiSave size={18} /> SIMPAN KE DATABASE
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ProductsPage;
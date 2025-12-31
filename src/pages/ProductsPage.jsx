import React, { useState, useEffect } from "react";
import { 
  FiPackage, FiPlus, FiEdit3, FiTrash2, 
  FiSearch, FiSave, FiX, 
  FiHash, FiTag, FiLayers, FiDollarSign, FiRefreshCw
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [lowStockThreshold, setLowStockThreshold] = useState(
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
      const savedThreshold = localStorage.getItem("low_stock_threshold");
      if (savedThreshold) setLowStockThreshold(Number(savedThreshold));
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
    if (window.confirm("Hapus produk ini?")) {
      saveToLocalStorage(products.filter(p => p.code !== code));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-sans pt-28 pb-32 transition-all duration-300">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 text-center md:text-left">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white uppercase tracking-tighter flex items-center justify-center md:justify-start gap-3">
              <FiLayers className="text-emerald-500" /> STOK BARANG
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Manajemen Inventaris Digital
            </p>
          </motion.div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <FiPlus size={20} /> TAMBAH PRODUK BARU
          </button>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
          <div className="md:col-span-4 bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800 flex items-center justify-center md:justify-start gap-5">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
              <FiPackage size={28} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Total Produk</p>
              <p className="text-2xl font-black dark:text-white leading-none">
                {products.length} <span className="text-sm font-bold text-slate-500 ml-1">SKU</span>
              </p>
            </div>
          </div>

          <div className="md:col-span-8 relative flex items-center">
            <div className="absolute left-7 flex items-center justify-center pointer-events-none">
              <FiSearch className="text-slate-400" size={22} />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama barang atau kode..."
              className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-white dark:bg-[#0f172a] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-[#0f172a] rounded-[3rem] shadow-sm border dark:border-slate-800 overflow-hidden">
          <table className="w-full text-center">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b dark:border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Nama Barang</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stok</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isLow = Number(p.stock) <= lowStockThreshold;
                return (
                  <tr key={p.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="px-8 py-6 text-left">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono font-bold text-emerald-500 mb-0.5">{p.code}</span>
                        <span className="font-black text-slate-800 dark:text-white uppercase">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-700 dark:text-slate-200">
                      Rp {Number(p.price).toLocaleString()}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase ${isLow ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600'}`}>
                        {p.stock} ITEMS
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleOpenModal(p)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all"><FiEdit3 size={18} /></button>
                        <button onClick={() => handleDelete(p.code)} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-5">
          {filteredProducts.map((p) => (
            <div key={p.code} className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
              <div className="flex justify-between items-start mb-5">
                <div className="text-left">
                  <span className="text-[9px] font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500 uppercase">{p.code}</span>
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-base mt-2">{p.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(p)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400"><FiEdit3 size={18} /></button>
                  <button onClick={() => handleDelete(p.code)} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400"><FiTrash2 size={18} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-[2rem]">
                <div className="text-left border-r dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Harga</p>
                  <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm">Rp {Number(p.price).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stok</p>
                  <p className={`font-black text-sm ${Number(p.stock) <= lowStockThreshold ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>{p.stock} Pcs</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* MODAL BERADA DI DALAM DIV UTAMA */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative"
              >
                <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <FiTag className="text-emerald-500" size={20} />
                    <h3 className="font-black dark:text-white uppercase text-xs tracking-widest">Detail Barang</h3>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors">
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Produk</label>
                      {!editingProduct && (
                        <button type="button" onClick={() => setFormData({...formData, code: generateAutoCode()})} className="text-emerald-500 text-[10px] font-black flex items-center gap-1">
                          <FiRefreshCw size={10} /> ACAK ULANG
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <FiHash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input readOnly className="w-full pl-14 p-4 rounded-2xl bg-slate-100 dark:bg-[#020617] dark:text-white font-mono font-black border-none outline-none text-sm" value={formData.code} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Barang</label>
                    <input 
                      autoFocus 
                      type="text" 
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500/50 transition-all text-sm" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Harga</label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input type="number" className="w-full pl-12 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500/50 outline-none text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Stok</label>
                      <div className="relative">
                        <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" className="w-full pl-12 p-4 rounded-2xl bg-slate-50 dark:bg-[#020617] dark:text-white font-black border-2 border-transparent focus:border-emerald-500/50 outline-none text-sm" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 uppercase text-xs tracking-[0.2em] mt-4 flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <FiSave size={20} /> Simpan Produk
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
import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiSearch, FiBox, FiFilter, FiTrash2, FiTrendingUp, FiAlertCircle 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { useProducts } from "./useProducts";

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); 
  const [sortBy, setSortBy] = useState("name");
  const searchRef = useRef(null);

  // Mengambil fungsi dari hook useProducts
  const { products, addOrUpdateProduct, deleteProduct, bulkDelete } = useProducts();
  
  const lowStockThreshold = Number(localStorage.getItem("low_stock_threshold")) || 5;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F2") { 
        e.preventDefault(); 
        searchRef.current?.focus(); 
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // FUNGSI SIMPAN YANG TERKONEKSI KE SEMUA HALAMAN
  const handleSave = (formData) => {
    const result = addOrUpdateProduct(formData, editingProduct);
    
    if (result.success) {
      setShowModal(false);
      setEditingProduct(null);
      // Opsional: Beri feedback sukses
    } else {
      alert(result.message);
    }
  };

  // LOGIC: Penyaringan & Pengurutan
  const filteredProducts = products
    .filter(p => 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock-low") return Number(a.stock) - Number(b.stock);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => Number(p.stock) <= lowStockThreshold).length
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-6 md:pt-10 pb-20 px-4 md:px-10 transition-colors duration-500 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter uppercase leading-none">
              STOK <span className="text-emerald-500">PRODUK</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">REAL-TIME INVENTORY</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <MiniStat icon={<FiTrendingUp size={14}/>} value={stats.total} label="Total" color="text-emerald-500" />
              <div className="w-[1px] bg-slate-100 dark:bg-slate-800 mx-1" />
              <MiniStat icon={<FiAlertCircle size={14}/>} value={stats.lowStock} label="Low" color="text-rose-500" />
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()} 
              className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-5 py-3.5 md:px-7 md:py-4 rounded-2xl font-black uppercase text-[11px] tracking-wider shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
            >
              <FiPlus size={18} strokeWidth={3} /> <span className="hidden sm:inline">Tambah Barang</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Pencarian</label>
                <div className="relative group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    ref={searchRef}
                    type="text" 
                    placeholder="Cari SKU / Nama..."
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none text-sm border border-transparent focus:border-emerald-500/20 focus:ring-4 ring-emerald-500/5 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Urutkan</label>
                <div className="relative group">
                  <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-11 pr-10 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none text-sm appearance-none cursor-pointer border border-transparent focus:border-emerald-500/20 transition-all"
                  >
                    <option value="name">Nama (A-Z)</option>
                    <option value="stock-low">Stok Terendah</option>
                    <option value="price-high">Harga Tertinggi</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {selectedItems.length > 0 && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    if(bulkDelete(selectedItems)) setSelectedItems([]);
                  }}
                  className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  <FiTrash2 /> Hapus ({selectedItems.length}) Terpilih
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* TABEL */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
            {filteredProducts.length > 0 ? (
              <ProductTable 
                products={filteredProducts}
                onEdit={handleOpenModal}
                onDelete={deleteProduct}
                lowStockThreshold={lowStockThreshold}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-40 text-slate-300">
                <FiBox size={40} className="opacity-20 mb-5" />
                <p className="font-black uppercase tracking-widest text-xs">Produk tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }} 
        onSave={handleSave} 
        product={editingProduct} 
      />
    </div>
  );
}

const MiniStat = ({ icon, value, label, color }) => (
  <div className="flex items-center gap-3 px-4 py-1.5">
    <div className={`${color} opacity-80`}>{icon}</div>
    <div className="flex flex-col">
      <span className="text-sm font-black dark:text-white leading-none">{value}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
  </div>
);

export default ProductsPage;
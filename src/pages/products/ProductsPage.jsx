import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiSearch, FiBox, FiDownload, FiFilter, FiTrash2 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Pastikan import ini sesuai dengan struktur folder Anda
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); 
  const [sortBy, setSortBy] = useState("name"); 
  const searchRef = useRef(null);

  // KUNCI UTAMA: Nama key harus sama dengan di halaman Transaksi
  const STORAGE_KEY = "products"; 
  const lowStockThreshold = Number(localStorage.getItem("low_stock_threshold")) || 5;

  useEffect(() => {
    loadData();
    const handleKeyDown = (e) => {
      if (e.key === "F2") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "F3") { e.preventDefault(); handleOpenModal(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProducts(JSON.parse(saved));
  };

  const saveToLocalStorage = (updated) => {
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Trigger event agar halaman Transaksi tahu ada perubahan data
    window.dispatchEvent(new Event("storage"));
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSave = (formData) => {
    // Logika Auto-SKU jika kode kosong
    if (!formData.code) {
      formData.code = "PRD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    let updated;
    if (editingProduct) {
      // Jika edit, cari berdasarkan index atau kode lama
      updated = products.map(p => p.code === editingProduct.code ? formData : p);
    } else {
      // Jika baru, cek apakah kode sudah ada (mencegah duplikat SKU)
      const exists = products.find(p => p.code === formData.code);
      if (exists) {
        alert("KODE/SKU sudah digunakan oleh produk lain!");
        return;
      }
      updated = [formData, ...products];
    }
    
    saveToLocalStorage(updated);
    setShowModal(false);
  };

  const handleDelete = (code) => {
    if (window.confirm("Hapus produk ini?")) {
      saveToLocalStorage(products.filter(p => p.code !== code));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Hapus ${selectedItems.length} produk yang dipilih?`)) {
      const remaining = products.filter(p => !selectedItems.includes(p.code));
      saveToLocalStorage(remaining);
      setSelectedItems([]);
    }
  };

  const exportCSV = () => {
    const headers = ["Kode,Nama,Harga,Stok\n"];
    const rows = products.map(p => `${p.code},${p.name},${p.price},${p.stock}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stok_produk_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const processedProducts = products
    .filter(p => 
      (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      (p.code?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock-low") return Number(a.stock) - Number(b.stock);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  const totalLowStock = products.filter(p => Number(p.stock) <= lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#020617] pt-10 md:pt-20 pb-36 md:pb-10 px-4 md:px-10 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-5xl font-black dark:text-white flex items-center gap-3 tracking-tighter uppercase text-slate-800 leading-none">
              Stok <span className="text-emerald-500">Produk</span>
            </h1>
            <div className="flex items-center gap-2 mt-4">
               <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                 {products.length} Items Terdaftar
               </span>
               {totalLowStock > 0 && (
                 <span className="bg-rose-500 text-white shadow-lg shadow-rose-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl animate-pulse">
                   {totalLowStock} Stok Menipis
                 </span>
               )}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <button onClick={exportCSV} className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white active:scale-95 transition-all shadow-sm">
              <FiDownload size={16} className="text-emerald-500" /> Export
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              <FiPlus size={18} /> Tambah Barang
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-6">
          <div className="lg:col-span-6 relative">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              ref={searchRef}
              type="text" 
              placeholder="Cari Nama atau SKU Produk... (F2)"
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 dark:text-white font-bold outline-none border border-slate-100 dark:border-slate-800 focus:border-emerald-500 shadow-sm transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="lg:col-span-3 relative">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-14 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-900 dark:text-white font-black appearance-none outline-none border border-slate-100 dark:border-slate-800 focus:border-emerald-500 text-[10px] uppercase tracking-widest shadow-sm cursor-pointer"
            >
              <option value="name">Nama A-Z</option>
              <option value="stock-low">Stok Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
            </select>
          </div>

          <div className="lg:col-span-3">
             <AnimatePresence>
               {selectedItems.length > 0 && (
                 <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleBulkDelete}
                  className="w-full h-full bg-rose-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                 >
                   <FiTrash2 /> Hapus ({selectedItems.length})
                 </motion.button>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* TABLE */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <ProductTable 
              products={processedProducts}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              lowStockThreshold={lowStockThreshold}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
          
          {processedProducts.length === 0 && (
            <div className="py-20 text-center">
              <FiBox className="mx-auto text-4xl text-slate-200 mb-4" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Barang tidak ditemukan</p>
            </div>
          )}
        </motion.div>
      </div>

      <ProductModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}

export default ProductsPage;
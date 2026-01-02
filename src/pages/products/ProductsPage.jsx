import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiSearch, FiBox, FiDownload, FiFilter, FiTrash2 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Import Komponen Terpisah
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
    const saved = localStorage.getItem("warung_products");
    if (saved) setProducts(JSON.parse(saved));
  };

  const saveToLocalStorage = (updated) => {
    setProducts(updated);
    localStorage.setItem("warung_products", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSave = (formData) => {
    const updated = editingProduct 
      ? products.map(p => p.code === editingProduct.code ? formData : p)
      : [formData, ...products];
    
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
    a.download = `stok_warung_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const processedProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock-low") return Number(a.stock) - Number(b.stock);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  const totalLowStock = products.filter(p => Number(p.stock) <= lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 md:pt-32 pb-32 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER SECTION - FULL EMERALD THEME */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black dark:text-white flex items-center gap-4 tracking-tighter uppercase">
              <FiBox className="text-emerald-500 shrink-0" /> Master <span className="text-emerald-500">Stock</span>
            </h1>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
               <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                 {products.length} SKU Terdaftar
               </span>
               <span className={`${totalLowStock > 0 ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-100 text-slate-400'} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all`}>
                 {totalLowStock} Perlu Restock
               </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:flex gap-4 w-full md:w-auto">
            <button 
              onClick={exportCSV} 
              className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest dark:text-white hover:border-emerald-500/50 transition-all group"
            >
              <FiDownload size={16} className="text-slate-400 group-hover:text-emerald-500" /> <span className="hidden sm:inline">Export</span> CSV
            </button>
            <button 
              onClick={() => handleOpenModal()} 
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <FiPlus size={18} /> Tambah <span className="hidden sm:inline">Barang</span>
            </button>
          </div>
        </div>

        {/* CONTROLS - GREEN ACCENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-8">
          <div className="lg:col-span-6 relative group">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              ref={searchRef}
              type="text" 
              placeholder="Cari kode atau nama produk... (F2)"
              className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] bg-white dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-emerald-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="lg:col-span-3 relative">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] bg-white dark:bg-slate-900 dark:text-white font-black appearance-none outline-none border-2 border-transparent focus:border-emerald-500 text-[10px] uppercase tracking-widest shadow-sm cursor-pointer"
            >
              <option value="name">Urut: Nama A-Z</option>
              <option value="stock-low">Urut: Stok Terendah</option>
              <option value="price-high">Urut: Harga Tertinggi</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
             <AnimatePresence>
               {selectedItems.length > 0 && (
                 <motion.button 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  onClick={handleBulkDelete}
                  className="w-full h-full bg-rose-500 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                 >
                   <FiTrash2 /> Hapus {selectedItems.length} Terpilih
                 </motion.button>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* DATA CONTAINER - EMERALD STYLE BORDER */}
        <div className="rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="p-1"> {/* Inner spacing for table feel */}
            <ProductTable 
              products={processedProducts}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              lowStockThreshold={lowStockThreshold}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        </div>

      </div>

      {/* MODAL COMPONENT */}
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
import React, { useState, useEffect } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiPackage, FiTag, FiSave, 
  FiX, FiAlertTriangle, FiInbox, FiDollarSign
} from "react-icons/fi";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: "",
    stock: ""
  });

  // Load Data dari LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("warung_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save Data ke LocalStorage
  const saveToLocal = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      // Generate kode otomatis sederhana
      setFormData({ 
        code: `PRD-${Math.floor(1000 + Math.random() * 9000)}`, 
        name: "", 
        price: "", 
        stock: "" 
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.price) return;

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.code === editingProduct.code ? formData : p);
    } else {
      if (products.some(p => p.code === formData.code)) {
        alert("❌ Kode produk sudah digunakan!");
        return;
      }
      updatedProducts = [formData, ...products];
    }

    saveToLocal(updatedProducts);
    setShowModal(false);
  };

  const handleDelete = (code) => {
    if (window.confirm("Hapus produk ini dari database?")) {
      const updated = products.filter(p => p.code !== code);
      saveToLocal(updated);
    }
  };

  // Kalkulasi Stats
  const totalItems = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock), 0);
  const lowStockCount = products.filter(p => Number(p.stock) <= 5).length;
  const assetValue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.stock)), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
              <FiInbox className="text-emerald-500" size={28} /> Inventaris Barang
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Kelola stok dan harga produk Anda</p>
          </div>
          {/* Tombol Ganti Warna Hijau (Emerald) */}
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            <FiPlus size={20} /> Tambah Produk Baru
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total SKU", val: totalItems, icon: <FiTag />, color: "text-blue-500" },
            { label: "Total Stok", val: totalStock, icon: <FiPackage />, color: "text-emerald-500" },
            { label: "Stok Tipis", val: lowStockCount, icon: <FiAlertTriangle />, color: "text-red-500" },
            { label: "Nilai Aset", val: `Rp ${assetValue.toLocaleString()}`, icon: <FiDollarSign />, color: "text-amber-500" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className={`${stat.color} mb-3`}>{stat.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black dark:text-white truncate">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Search & List */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="Cari nama atau kode barang..."
                className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-900 dark:text-white border-2 border-transparent focus:border-emerald-500/50 outline-none transition-all text-sm font-bold shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b dark:border-slate-700">
                  <th className="px-8 py-6">Info Produk</th>
                  <th className="px-8 py-6">Kode</th>
                  <th className="px-8 py-6">Harga Jual</th>
                  <th className="px-8 py-6">Stok</th>
                  <th className="px-8 py-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-tight">{product.name}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg dark:text-slate-300 uppercase font-bold tracking-wider">
                        {product.code}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                        Rp {Number(product.price).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-base ${Number(product.stock) <= 5 ? 'text-red-500' : 'dark:text-white'}`}>
                          {product.stock}
                        </span>
                        {Number(product.stock) <= 5 && <FiAlertTriangle size={16} className="text-red-500 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(product)} className="p-3 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.code)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <FiPackage size={60} className="mx-auto mb-4 opacity-10 dark:text-white" />
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest italic">Barang tidak ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3rem] shadow-2xl p-10 border border-white/10 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Kode Barang</label>
                <input 
                  type="text"
                  required
                  disabled={!!editingProduct}
                  placeholder="Scan atau ketik kode..."
                  className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none transition-all disabled:opacity-50 shadow-inner"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nama Produk</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Beras 5kg"
                  className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none transition-all shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Harga Jual</label>
                  <input 
                    type="number"
                    required
                    placeholder="0"
                    className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none transition-all shadow-inner"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Stok</label>
                  <input 
                    type="number"
                    required
                    placeholder="0"
                    className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none transition-all shadow-inner"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              {/* Tombol Simpan Hijau Emerald */}
              <button 
                type="submit"
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase text-xs tracking-widest mt-6"
              >
                <FiSave size={20} /> Simpan Inventaris
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
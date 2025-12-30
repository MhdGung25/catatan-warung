import React, { useState, useEffect } from "react";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, 
  FiSave, FiX, FiAlertTriangle, FiArrowUp, FiArrowDown,
  FiShoppingBag, FiCoffee, FiTruck, FiBox
} from "react-icons/fi";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: "",
    stock: "",
    category: "Umum"
  });

  useEffect(() => {
    const saved = localStorage.getItem("warung_products");
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const saveToLocal = (updatedProducts) => {
    localStorage.setItem("warung_products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ code: "", name: "", price: "", stock: "", category: "Umum" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updated;
    if (editingProduct) {
      updated = products.map(p => p.code === editingProduct.code ? formData : p);
    } else {
      if (products.find(p => p.code === formData.code)) {
        alert("Kode produk sudah ada!");
        return;
      }
      updated = [formData, ...products];
    }
    saveToLocal(updated);
    setIsModalOpen(false);
  };

  const deleteProduct = (code) => {
    if (window.confirm("Hapus produk ini secara permanen?")) {
      const updated = products.filter(p => p.code !== code);
      saveToLocal(updated);
    }
  };

  const processedProducts = products
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Makanan": return <FiShoppingBag className="mr-2" />;
      case "Minuman": return <FiCoffee className="mr-2" />;
      case "Sembako": return <FiTruck className="mr-2" />;
      default: return <FiBox className="mr-2" />;
    }
  };

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans pb-10">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight flex items-center gap-3">
              <FiPackage className="text-emerald-500" size={28} /> Inventori Barang
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Kelola stok dan harga produk warung Anda</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-95 text-xs uppercase"
          >
            <FiPlus size={20} /> Tambah Produk
          </button>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produk</p>
            <p className="text-3xl font-black dark:text-white">{products.length}</p>
          </div>
          
          <div className="md:col-span-3 relative flex items-center group">
            <div className="absolute left-6 flex items-center justify-center pointer-events-none h-full">
              <FiSearch className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={22} />
            </div>
            <input 
              type="text"
              placeholder="Cari berdasarkan nama atau kode barang..."
              className="w-full pl-16 pr-6 py-5 rounded-3xl bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] border-b dark:border-slate-700">
                  <th className="p-6">Info Barang</th>
                  <th className="p-6">Kategori</th>
                  <th className="p-6">Harga Jual</th>
                  <th 
                    className="p-6 text-center cursor-pointer hover:text-emerald-500 transition-colors"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Stok {sortOrder === "asc" ? <FiArrowUp /> : <FiArrowDown />}
                    </div>
                  </th>
                  <th className="p-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700/50">
                {processedProducts.map((p) => (
                  <tr key={p.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="p-6">
                      <p className="font-black dark:text-white uppercase text-sm tracking-tight">{p.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">#{p.code}</p>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-full text-[10px] font-bold uppercase">
                        {getCategoryIcon(p.category)} {p.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-emerald-600 dark:text-emerald-400">Rp {Number(p.price).toLocaleString()}</p>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`font-black text-lg ${Number(p.stock) <= 5 ? 'text-red-500 animate-pulse' : 'dark:text-white'}`}>
                          {p.stock}
                        </span>
                        {Number(p.stock) <= 5 && (
                          <span className="text-[8px] font-black text-red-500 flex items-center gap-1 uppercase">
                            <FiAlertTriangle /> Stok Tipis
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(p)} className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all">
                          <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => deleteProduct(p.code)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-2xl transition-all">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                {editingProduct ? 'Update Produk' : 'Tambah Produk'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                <FiX size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kode Barang</label>
                  <input 
                    required disabled={editingProduct}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none disabled:opacity-50 shadow-inner"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none shadow-inner"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Umum">Umum</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Sembako">Sembako</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Barang</label>
                <input 
                  required 
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none shadow-inner"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                  <input 
                    required type="number"
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none shadow-inner"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stok</label>
                  <input 
                    required type="number"
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-emerald-500 outline-none shadow-inner"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 mt-4 active:scale-95 uppercase text-xs"
              >
                <FiSave size={20} /> Simpan Produk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
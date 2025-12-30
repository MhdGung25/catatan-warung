import React, { useState, useEffect, useRef } from "react";
import { 
  FiPlus, FiTrash2, FiHash, FiTag, FiShoppingBag, 
  FiDollarSign, FiLayers, FiAlertCircle 
} from "react-icons/fi";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const codeInputRef = useRef(null);
  const [newItem, setNewItem] = useState({ code: "", name: "", price: "", stock: "" });

  // 1. FIX: AUTO SCROLL KE ATAS SAAT HALAMAN DIBUKA/DI-REFRESH
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const loadProducts = () => {
    const savedProducts = localStorage.getItem("warung_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
    const handleStorageChange = () => loadProducts();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("warung_products", JSON.stringify(products));
    }
  }, [products, loading]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.code || !newItem.stock) {
      alert("⚠️ Mohon lengkapi semua data produk!");
      return;
    }

    const existingIndex = products.findIndex(p => p.code === newItem.code);
    if (existingIndex !== -1) {
      if (window.confirm("Produk sudah ada. Tambah stoknya?")) {
        const updatedProducts = [...products];
        updatedProducts[existingIndex].stock += parseInt(newItem.stock);
        updatedProducts[existingIndex].price = parseInt(newItem.price);
        setProducts(updatedProducts);
      }
    } else {
      const newEntry = {
        id: Date.now(),
        code: newItem.code.trim(),
        name: newItem.name.trim(),
        price: parseInt(newItem.price),
        stock: parseInt(newItem.stock),
      };
      setProducts([newEntry, ...products]);
    }

    setNewItem({ code: "", name: "", price: "", stock: "" });
    if (codeInputRef.current) codeInputRef.current.focus();
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus produk ini?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    /* PENTING: 
       - pt-28 (Desktop) & pt-24 (Mobile) menjaga konten tetap di bawah navbar.
       - min-h-[100vh] memastikan background gelap tetap penuh meskipun data kosong.
    */
    <div className="pt-24 md:pt-32 p-4 md:p-10 min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-all font-sans pb-44 md:pb-24">
      
      {/* HEADER SECTION */}
      <div className="mb-10 text-center md:text-left animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
          Gudang Utama
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium italic">
          Kelola stok barang dagangan Anda di sini secara aman.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        
        {/* FORM INPUT (KIRI/ATAS) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 h-fit lg:sticky lg:top-32 z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <FiPlus size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Tambah Produk</h2>
          </div>
          
          <form onSubmit={handleAddProduct} className="space-y-5">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Kode Barcode</label>
              <div className="relative group">
                <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  ref={codeInputRef}
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                  value={newItem.code}
                  onChange={(e) => setNewItem({...newItem, code: e.target.value})}
                  placeholder="Ketik/Scan kode..."
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nama Barang</label>
              <div className="relative group">
                <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Nama produk..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Harga Jual</label>
                <div className="relative group">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-indigo-500 focus:bg-white shadow-inner outline-none transition-all"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    placeholder="Rp"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Stok</label>
                <div className="relative group">
                  <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 dark:text-white font-bold border-2 border-transparent focus:border-indigo-500 focus:bg-white shadow-inner outline-none transition-all"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 mt-4 active:scale-95 tracking-widest text-sm"
            >
              SIMPAN KE GUDANG
            </button>
          </form>
        </div>

        {/* LIST STOK (KANAN/BAWAH) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/20">
              <h3 className="font-black text-lg md:text-xl flex items-center gap-3 dark:text-white">
                <FiTag className="text-indigo-500" /> Stok Saat Ini
              </h3>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full font-black uppercase tracking-tighter">
                {products.length} Jenis Barang
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              {/* Desktop Table View */}
              <table className="w-full text-left hidden md:table">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Barang</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Harga</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Stok</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-24 text-center text-slate-400 italic font-bold">Gudang masih kosong.</td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-800 dark:text-white text-lg leading-tight">{p.name}</p>
                          <p className="text-xs text-slate-400 font-mono uppercase">ID: {p.code}</p>
                        </td>
                        <td className="px-8 py-6 text-center font-black text-emerald-600 text-lg">
                          Rp {p.price.toLocaleString('id-ID')}
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-2 rounded-xl font-black text-sm ${
                            p.stock <= 5 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button onClick={() => handleDelete(p.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all">
                            <FiTrash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
                {products.length === 0 ? (
                  <div className="py-24 text-center text-slate-400 italic font-bold">Gudang Kosong.</div>
                ) : (
                  products.map((p) => (
                    <div key={p.id} className="p-6 flex justify-between items-center active:bg-slate-50 dark:active:bg-slate-900/50 transition-colors">
                      <div className="flex-1 pr-4">
                        <p className="font-black text-slate-800 dark:text-white text-base mb-1">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mb-2 uppercase tracking-tighter">ID: {p.code}</p>
                        <p className="font-black text-emerald-600 text-sm bg-emerald-50 dark:bg-emerald-500/10 inline-block px-3 py-1 rounded-lg">
                          Rp {p.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                         <span className={`px-4 py-2 rounded-2xl font-black text-xs ${
                            p.stock <= 5 
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
                              : 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            Stok: {p.stock}
                          </span>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2.5 text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl active:scale-90 transition-transform"
                          >
                            <FiTrash2 size={18} />
                          </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Tips Section */}
          <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0">
              <FiAlertCircle size={20} />
            </div>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
              Tips: Masukkan kode produk yang sama untuk menambah stok secara otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
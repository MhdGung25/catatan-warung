import { useState, useEffect } from "react";

export function useProducts() {
  const STORAGE_KEY = "products";

  // 1. Inisialisasi state dari LocalStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Fungsi Pusat Simpan Data (Hanya Satu)
  const saveToLocalStorage = (updated) => {
    // Simpan ke State
    setProducts(updated);
    // Simpan ke LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Trigger event agar tab lain/halaman lain tahu ada perubahan
    window.dispatchEvent(new Event("storage")); 
    // Trigger custom event untuk halaman dalam tab yang sama (Dashboard/Laporan)
    window.dispatchEvent(new CustomEvent("data-updated")); 
  };

  // 3. Listener Sinkronisasi
  useEffect(() => {
    const handleSync = () => {
      const updatedData = localStorage.getItem(STORAGE_KEY);
      if (updatedData) {
        setProducts(JSON.parse(updatedData));
      }
    };

    // Dengar perubahan dari tab lain
    window.addEventListener("storage", handleSync);
    // Dengar perubahan dari halaman lain dalam satu tab
    window.addEventListener("data-updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("data-updated", handleSync);
    };
  }, []);

  /**
   * LOGIKA TAMBAH ATAU EDIT PRODUK
   */
  const addOrUpdateProduct = (formData, editingProduct = null) => {
    // Pastikan angka benar-benar tipe Number (Penting untuk Dashboard & Laporan)
    const formattedData = {
      ...formData,
      price: Number(formData.price || 0),
      stock: Number(formData.stock || 0)
    };

    // Auto-generate SKU jika kosong
    if (!formattedData.code) {
      formattedData.code = "PRD-" + Math.random().toString(36).substr(2, 7).toUpperCase();
    }

    let updatedList;

    if (editingProduct) {
      // Mode Edit: Cari berdasarkan code yang lama
      updatedList = products.map(p => 
        p.code === editingProduct.code ? formattedData : p
      );
    } else {
      // Mode Tambah Baru: Cek duplikat SKU
      const isDuplicate = products.some(p => p.code === formattedData.code);
      if (isDuplicate) {
        return { success: false, message: "KODE/SKU sudah digunakan!" };
      }
      updatedList = [formattedData, ...products];
    }
    
    saveToLocalStorage(updatedList);
    return { success: true };
  };

  /**
   * HAPUS PRODUK SATUAN
   */
  const deleteProduct = (code) => {
    if (window.confirm("Hapus produk ini dari inventaris?")) {
      const remaining = products.filter(p => p.code !== code);
      saveToLocalStorage(remaining);
      return true;
    }
    return false;
  };

  /**
   * HAPUS PRODUK MASAL (BULK)
   */
  const bulkDelete = (selectedCodes) => {
    if (window.confirm(`Hapus ${selectedCodes.length} produk yang dipilih?`)) {
      const remaining = products.filter(p => !selectedCodes.includes(p.code));
      saveToLocalStorage(remaining);
      return true;
    }
    return false;
  };

  return { 
    products, 
    addOrUpdateProduct, 
    deleteProduct, 
    bulkDelete,
    saveToLocalStorage 
  };
}
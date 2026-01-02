import { useState, useEffect } from "react";

// Struktur data default yang sinkron dengan komponen UI Settings baru
const DEFAULT_SETTINGS = {
  general: {
    warungName: "Warung Digital",
    phone: "",
    address: "",
    logo: ""
  },
  payment: {
    cash: true,
    transfer: false, // Diperbarui dari 'bank' ke 'transfer'
    qris: true,
    merchantName: "", // Field baru untuk QRIS
    nmid: "",        // Field baru untuk QRIS
  },
  cashier: {
    enableShortcuts: true, // Sinkron dengan UI CashierSettings
    autoFocusSearch: true,
    confirmClearCart: true,
    autoPrint: false       // Field baru untuk kasir
  },
  stock: {
    lowStockThreshold: 5,
    preventOutOfStockSale: true,
    enableNotifications: true // Field baru untuk peringatan stok
  },
  receipt: {
    headerText: "--- RECEIPT ---", // Field baru untuk header
    footerNote: "Terima kasih sudah belanja 🙏",
    showPaymentMethod: true,
    autoCut: false // Field baru untuk printer thermal
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data dari LocalStorage saat pertama kali aplikasi dijalankan
  useEffect(() => {
    try {
      const saved = localStorage.getItem("warung_settings");
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        
        // Deep merge untuk memastikan field baru tetap ada meskipun user punya data lama
        setSettings(prev => ({
          ...prev,
          ...parsedSettings,
          // Merge sub-objek agar field baru di dalam kategori tidak hilang
          general: { ...prev.general, ...parsedSettings.general },
          payment: { ...prev.payment, ...parsedSettings.payment },
          cashier: { ...prev.cashier, ...parsedSettings.cashier },
          stock: { ...prev.stock, ...parsedSettings.stock },
          receipt: { ...prev.receipt, ...parsedSettings.receipt },
        }));
      }
    } catch (error) {
      console.error("Gagal memuat pengaturan:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Fungsi Update Global
  const update = (section, key, value) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      };
      
      // Simpan ke LocalStorage setiap kali ada perubahan
      localStorage.setItem("warung_settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Fungsi Reset (Opsional: Berguna jika user ingin kembali ke setelan pabrik)
  const resetToDefault = () => {
    if (window.confirm("Kembalikan semua pengaturan ke default?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem("warung_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
  };

  return { settings, update, isLoaded, resetToDefault };
};

export default useSettings;
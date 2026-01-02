import { useState, useEffect } from "react";

// Hapus 'export' di depan const, pindahkan ke bawah sebagai 'default'
const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Sinkronisasi dengan localStorage agar saat refresh mode tidak hilang
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Simpan pilihan user ke localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

// WAJIB TAMBAHKAN INI:
export default useDarkMode;
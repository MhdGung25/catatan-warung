import { useEffect } from "react";

const useKeyboard = ({ onPay, onFocusSearch, onClear }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F2: Tombol untuk Pembayaran / Selesai
      if (e.key === "F2") {
        e.preventDefault();
        if (onPay) onPay();
      }

      // F9: Fokus ke kolom Pencarian Barang
      if (e.key === "F9") {
        e.preventDefault();
        if (onFocusSearch) onFocusSearch();
      }

      // Escape: Batalkan transaksi / Bersihkan keranjang
      if (e.key === "Escape") {
        e.preventDefault();
        if (onClear) onClear();
      }
    };

    // Pasang listener saat komponen dimuat
    window.addEventListener("keydown", handleKeyDown);

    // Bersihkan listener saat komponen dilepas (mencegah memory leak)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPay, onFocusSearch, onClear]); // Dependency array memastikan fungsi terbaru yang dipanggil
};

export default useKeyboard;
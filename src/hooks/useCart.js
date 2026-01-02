import { useMemo, useState, useCallback, useEffect } from "react";

const useCart = () => {
  // 1. Inisialisasi: Ambil data dari localStorage saat pertama kali load
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("warung_cart_active");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Persistence: Simpan ke localStorage setiap kali 'cart' berubah
  useEffect(() => {
    localStorage.setItem("warung_cart_active", JSON.stringify(cart));
  }, [cart]);

  // ADD / UPDATE ITEM (Dengan validasi stok)
  const addItem = useCallback((product) => {
    const delta = product.qty ?? 1;

    setCart((prev) => {
      const found = prev.find((p) => p.code === product.code);
      
      if (found) {
        // Validasi: Cegah qty menjadi minus atau melebihi stok yang tersedia
        const newQty = found.qty + delta;
        
        // Jika hasil akhirnya 0 atau kurang, hapus dari keranjang
        if (newQty <= 0) {
          return prev.filter((p) => p.code !== product.code);
        }

        // Cek apakah stok cukup (Opsional: tergantung data stok yang dikirim)
        if (product.stock !== undefined && newQty > product.stock && delta > 0) {
          alert(`⚠️ Stok tidak cukup! Maksimal: ${product.stock}`);
          return prev;
        }

        return prev.map((p) =>
          p.code === product.code ? { ...p, qty: newQty } : p
        );
      }

      // Jika item baru ditambahkan (delta harus positif)
      return delta > 0 ? [...prev, { ...product, qty: delta }] : prev;
    });
  }, []);

  // REMOVE ITEM
  const removeItem = useCallback((code) => {
    setCart((prev) => prev.filter((p) => p.code !== code));
  }, []);

  // CLEAR CART
  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem("warung_cart_active");
  }, []);

  // TOTAL QTY
  const totalQty = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  // TOTAL PRICE
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty * (Number(item.price) || 0), 0),
    [cart]
  );

  return {
    cart,
    setCart, // Expose setCart jika butuh manipulasi manual
    addItem,
    removeItem,
    clearCart,
    totalQty,
    totalPrice,
  };
};

export default useCart;
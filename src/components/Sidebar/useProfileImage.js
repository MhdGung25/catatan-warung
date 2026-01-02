import { useEffect, useState } from "react";

/**
 * Hook untuk mengelola dan mensinkronkan gambar profil warung
 * dari localStorage secara real-time di seluruh komponen.
 */
export default function useProfileImage() {
  const [image, setImage] = useState(null);

  const syncProfileImage = () => {
    try {
      const saved = localStorage.getItem("warung_profile_image");
      // Validasi: pastikan bukan string "null" atau "undefined" dari localStorage
      if (saved && saved !== "" && saved !== "null" && saved !== "undefined") {
        setImage(saved);
      } else {
        setImage(null);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi gambar profil:", error);
      setImage(null);
    }
  };

  useEffect(() => {
    // 1. Jalankan sinkronisasi saat pertama kali komponen mount
    syncProfileImage();

    // 2. Listener untuk perubahan dari tab/window lain
    window.addEventListener("storage", syncProfileImage);

    // 3. Custom Listener untuk perubahan di tab yang sama
    // Ini berguna agar saat user ganti foto di Settings, TopBar langsung berubah
    window.addEventListener("profileUpdate", syncProfileImage);

    return () => {
      window.removeEventListener("storage", syncProfileImage);
      window.removeEventListener("profileUpdate", syncProfileImage);
    };
  }, []);

  return image;
}

/**
 * HELPER FUNCTION (Opsional)
 * Gunakan fungsi ini di halaman Settings saat menyimpan foto profil
 * agar tab yang sama langsung terupdate tanpa refresh.
 */
export const updateProfileImage = (base64Image) => {
  localStorage.setItem("warung_profile_image", base64Image);
  // Memicu event custom agar hook useProfileImage di tab yang sama menyadari perubahan
  window.dispatchEvent(new Event("profileUpdate"));
};
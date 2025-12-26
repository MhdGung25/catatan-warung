// 1. Import fungsi yang dibutuhkan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 2. Konfigurasi Firebase (Gunakan data terbaru yang kamu dapatkan)
const firebaseConfig = {
  apiKey: "AIzaSyDxarQSYVOIjI1Q6jnPdaRbIAhUCBjQJp4",
  authDomain: "catatan-warung.firebaseapp.com",
  projectId: "catatan-warung",
  storageBucket: "catatan-warung.firebasestorage.app",
  messagingSenderId: "615793606214",
  appId: "1:615793606214:web:b1b1854f644d0e7e371447",
  measurementId: "G-983LP7FX3N"
};

// 3. Inisialisasi Firebase (Hanya boleh dipanggil satu kali)
const app = initializeApp(firebaseConfig);

// 4. Inisialisasi Layanan (Firestore, Auth, Analytics)
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Export 'app' sebagai default jika dibutuhkan di tempat lain
export default app;
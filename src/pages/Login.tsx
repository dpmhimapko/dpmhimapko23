import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, ArrowRight, AlertCircle, LogIn } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { auth, googleProvider, signInWithPopup, signOut } from "../firebase";
import { useAuth } from "../FirebaseProvider";

export default function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'admin') {
        navigate("/admin");
      } else if (role === 'user') {
        setError("Akun Anda (" + user.email + ") tidak memiliki hak akses administrator. Silakan hubungi admin utama atau masuk dengan akun lain.");
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setError("");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError("Popup diblokir oleh browser. Silakan izinkan popup atau klik tombol 'Open in new tab' di pojok kanan atas aplikasi.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Proses masuk dibatalkan.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Koneksi internet bermasalah. Silakan coba lagi.");
      } else {
        setError("Gagal masuk dengan Google. Pastikan Anda menggunakan akun yang terdaftar sebagai admin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 shadow-2xl shadow-maroon-600/5 border border-gray-100"
        >
          <div className="text-center mb-8 sm:mb-10">
            <Link to="/" className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 shadow-xl shadow-maroon-600/10 transition-transform hover:scale-110 border border-gray-100 p-2">
              <img 
                src="https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000" 
                alt="DPM HIMA PKO Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Login Admin</h1>
            <p className="text-gray-500 text-xs sm:text-sm">Kelola konten website DPM HIMA PKO.</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={cn(
                  "w-full py-4 sm:py-5 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl sm:rounded-2xl transition-all flex items-center justify-center space-x-3 hover:bg-gray-50 active:scale-[0.98]",
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-maroon-600/30 border-t-maroon-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-maroon-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  Keluar & Gunakan Akun Lain
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">{error}</p>
              </motion.div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-xs">
              Hanya untuk pengurus yang memiliki akses. <br />
              Butuh bantuan? <a href="#" className="text-maroon-600 font-bold hover:underline">Hubungi Humas</a>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 text-sm font-bold hover:text-maroon-600 transition-colors inline-flex items-center">
            <ArrowRight size={16} className="mr-2 rotate-180" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Trophy, Users, Newspaper, Image as ImageIcon, MessageSquare, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

const navLinks = [
  { name: "Beranda", path: "/", icon: Trophy },
  { name: "Profil", path: "/profil", icon: ShieldCheck },
  { name: "Anggota", path: "/anggota", icon: Users },
  { name: "Berita", path: "/berita", icon: Newspaper },
  { name: "Galeri", path: "/galeri", icon: ImageIcon },
  { name: "Aspirasi", path: "/aspirasi", icon: MessageSquare },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-sm border border-gray-100">
              <img 
                src="https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000" 
                alt="DPM HIMA PKO Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg leading-none text-gray-900">
                DPM HIMA PKO
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-maroon-600">
                Universitas Pendidikan Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2",
                    isActive
                      ? "bg-maroon-600 text-white"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon size={16} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <Link
              to="/login"
              className={cn(
                "ml-4 px-5 py-2 rounded-full text-sm font-bold transition-all",
                scrolled
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-maroon-600 text-white hover:bg-maroon-700"
              )}
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg transition-all active:scale-90 text-gray-900 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive ? "bg-maroon-50 text-maroon-600" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Icon size={20} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/login"
                className="flex items-center space-x-4 px-4 py-3 rounded-xl text-base font-bold text-white bg-maroon-600 hover:bg-maroon-700 mt-4"
              >
                <ShieldCheck size={20} />
                <span>Login Admin</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

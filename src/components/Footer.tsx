import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, MapPin, Phone, Trophy } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6 text-center sm:text-left">
            <Link to="/" className="flex items-center justify-center sm:justify-start space-x-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-lg border border-gray-800">
                <img 
                  src="https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000" 
                  alt="DPM HIMA PKO Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg sm:text-xl text-white leading-none tracking-tight">
                  DPM HIMA PKO
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-maroon-400">
                  Universitas Pendidikan Indonesia
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Dewan Perwakilan Mahasiswa Himpunan Mahasiswa Pendidikan Kepelatihan Olahraga. 
              Wadah aspirasi, pengawasan, dan legislasi mahasiswa PKO.
            </p>
            <div className="flex items-center justify-center sm:justify-start space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-maroon-600 transition-colors text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-maroon-600 transition-colors text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-maroon-600 transition-colors text-white">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-6 bg-maroon-600 rounded-full" />
              <span>Tautan Cepat</span>
            </h3>
            <ul className="space-y-4">
              <li><Link to="/profil" className="hover:text-maroon-400 transition-colors">Profil Organisasi</Link></li>
              <li><Link to="/anggota" className="hover:text-maroon-400 transition-colors">Struktur Anggota</Link></li>
              <li><Link to="/berita" className="hover:text-maroon-400 transition-colors">Berita & Kegiatan</Link></li>
              <li><Link to="/galeri" className="hover:text-maroon-400 transition-colors">Galeri Dokumentasi</Link></li>
              <li><Link to="/aspirasi" className="hover:text-maroon-400 transition-colors">Layanan Aspirasi</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-6 bg-maroon-600 rounded-full" />
              <span>Kontak Kami</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-maroon-500 mt-1 shrink-0" size={20} />
                <span className="text-sm">Gedung Ormawa, Kampus Pusat Universitas Pendidikan Indonesia, Indonesia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-maroon-500 shrink-0" size={20} />
                <span className="text-sm">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-maroon-500 shrink-0" size={20} />
                <span className="text-sm">dpmhimapko@university.ac.id</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-1.5 h-6 bg-maroon-600 rounded-full" />
              <span>Dukung Kami</span>
            </h3>
            <p className="text-sm mb-4 text-gray-400">
              Dapatkan informasi terbaru seputar kegiatan DPM HIMA PKO langsung di email Anda.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="bg-gray-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-maroon-600 transition-all outline-none"
              />
              <button className="bg-maroon-600 hover:bg-maroon-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg shadow-maroon-900/20">
                Berlangganan
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DPM HIMA PKO. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-maroon-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-maroon-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

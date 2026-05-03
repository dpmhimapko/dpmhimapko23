import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { Trophy, ArrowRight, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, limit, onSnapshot, OperationType, handleFirestoreError, where } from "../firebase";


export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [bestStaff, setBestStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    const qNews = query(collection(db, "news"), orderBy("date", "desc"), limit(3));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => {
        const data = doc.data();
        let dateStr = "Tanpa Tanggal";
        if (data.date) {
          try {
            const d = typeof data.date.toDate === 'function' ? data.date.toDate() : new Date(data.date);
            dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          } catch (e) {
            console.error("Date conversion error:", e);
          }
        }
        return {
          id: doc.id,
          ...data,
          date: dateStr
        };
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    const qReward = query(collection(db, "news"), where("category", "==", "Reward"), orderBy("date", "desc"), limit(1));
    const unsubReward = onSnapshot(qReward, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        let dateStr = "Tanpa Tanggal";
        if (data.date) {
          try {
            const d = typeof data.date.toDate === 'function' ? data.date.toDate() : new Date(data.date);
            dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          } catch (e) {
            console.error("Date conversion error:", e);
          }
        }
        setBestStaff({
          id: doc.id,
          ...data,
          date: dateStr
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    return () => {
      unsubNews();
      unsubReward();
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen relative bg-[#fcfcfc]">
      {/* Global Geometric SVG Background (Continuous Shards) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-90">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full pointer-events-none"
        >
          <rect width="1000" height="1000" fill="#fcfcfc" />
          
          {/* Geometric shards with distinct gray levels */}
          <polygon points="0,0 500,0 0,600" fill="#f5f5f5" />
          <polygon points="500,0 1000,0 1000,250 800,100" fill="#f0f0f0" />
          <polygon points="1000,250 1000,800 650,500" fill="#ececec" />
          <polygon points="0,600 600,1000 0,1000" fill="#f2f2f2" />
          <polygon points="600,1000 1000,1000 1000,800" fill="#ededed" />
          
          {/* Overlapping shards to create depth and continuity */}
          <polygon points="200,300 700,200 450,600" fill="#f9f9f9" opacity="0.6" />
          <polygon points="700,200 1000,500 750,700" fill="#f4f4f4" opacity="0.7" />
          <polygon points="300,700 800,900 500,1000 150,950" fill="#eeeeee" opacity="0.5" />
          
          {/* Accent border lines for "cracked" paper look */}
          <g stroke="#000000" strokeWidth="0.3" opacity="0.04">
            <line x1="0" y1="0" x2="500" y2="0" />
            <line x1="500" y1="0" x2="1000" y2="250" />
            <line x1="1000" y1="250" x2="650" y2="500" />
            <line x1="650" y1="500" x2="0" y2="600" />
            <line x1="0" y1="600" x2="600" y2="1000" />
            <line x1="600" y1="1000" x2="1000" y2="1000" />
          </g>
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#fcfcfc] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#ffffff_95%)] opacity-30" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85dvh] pt-32 pb-16 flex items-center justify-center overflow-hidden z-10">

        {/* Decorative Floating Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/4 left-10 w-12 h-12 bg-maroon-100 rounded-2xl rotate-12 opacity-40 hidden lg:block"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-10 w-16 h-16 bg-maroon-50 rounded-full opacity-40 hidden lg:block"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-maroon-200 rounded-lg -rotate-12 opacity-30 hidden lg:block"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-900 py-20"
        >

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.1]"
          >
            Wadah Aspirasi <br className="hidden sm:block" />
            <span className="text-maroon-600">Mahasiswa PKO UPI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 font-medium"
          >
            Membangun lembaga yang aspiratif dengan mengedepankan kolektif suara, 
            transparansi, dan kolaborasi untuk seluruh mahasiswa PKO FPOK UPI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4"
          >
            <Link 
              to="/aspirasi" 
              className="group/btn w-full sm:w-auto px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-maroon-600/25 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Sampaikan Aspirasi</span>
              <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
            <Link 
              to="/profil" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center active:scale-95 border border-transparent hover:border-gray-200"
            >
              Tentang Kami
            </Link>
          </motion.div>
        </motion.div>

      </section>



      {/* Latest News Preview */}
      <section className="py-16 sm:py-24 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-12"
          >
            <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Berita Terbaru</h2>
              <p className="text-gray-600 text-sm sm:text-base">Ikuti perkembangan terbaru kegiatan dan program kerja kami.</p>
            </div>
            <Link to="/berita" className="text-maroon-600 font-bold flex items-center hover:underline text-sm sm:text-base mx-auto md:mx-0">
              Lihat Semua Berita <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="h-56 bg-gray-200 relative">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-maroon-600 text-white text-xs font-bold rounded-full">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-gray-400 text-xs font-medium mb-2">{news.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                    {news.content}
                  </p>
                  <Link to={`/berita/${news.id}`} className="text-maroon-600 font-bold text-sm flex items-center group">
                    Baca Selengkapnya 
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
            {latestNews.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 text-sm">Belum ada berita terbaru.</div>
            )}
          </div>
        </div>
      </section>

      {/* Reward Highlight */}
      <section className="py-16 sm:py-24 bg-maroon-600 relative overflow-hidden z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 1.2 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 w-1/4 h-full bg-black/5 skew-x-12 -translate-x-1/2" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-white text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-bold mb-4 sm:mb-6">
                <Star size={14} className="fill-white" />
                <span>Apresiasi Anggota</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Penghargaan Ketua & <br /> Staff Terbaik
              </h2>
              <p className="text-maroon-100 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Kami memberikan apresiasi setinggi-tingginya kepada pengurus yang telah 
                menunjukkan dedikasi dan kontribusi luar biasa dalam menjalankan amanah.
              </p>
              {bestStaff ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] mb-8 text-left"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{bestStaff.title}</h3>
                  <p className="text-maroon-100 text-xs sm:text-sm mb-6 line-clamp-2">{bestStaff.content}</p>
                  <Link 
                    to={`/berita/${bestStaff.id}`} 
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-maroon-600 font-bold rounded-xl hover:bg-maroon-50 transition-all shadow-xl text-sm sm:text-base"
                  >
                    Lihat Selengkapnya
                  </Link>
                </motion.div>
              ) : (
                <Link 
                  to="/berita" 
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-maroon-600 font-bold rounded-xl hover:bg-maroon-50 transition-all shadow-xl text-sm sm:text-base"
                >
                  Lihat Daftar Penerima
                </Link>
              )}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 grid grid-cols-2 gap-4 w-full"
            >
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 rounded-full flex items-center justify-center text-white mb-3 sm:mb-4">
                  <Trophy size={20} />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">Ketua Terbaik</h4>
                <p className="text-maroon-200 text-[10px] sm:text-sm">Kepemimpinan yang inspiratif dan visioner.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mt-6 sm:mt-8"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400 rounded-full flex items-center justify-center text-white mb-3 sm:mb-4">
                  <Star size={20} />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">Staff Terbaik</h4>
                <p className="text-maroon-200 text-[10px] sm:text-sm">Dedikasi tinggi dalam setiap program kerja.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

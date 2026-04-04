import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Trophy, Users, Newspaper, MessageSquare, ArrowRight, ShieldCheck, Star, Calendar, User, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, limit, onSnapshot, OperationType, handleFirestoreError, where } from "../firebase";

const features = [
  {
    title: "Profil Organisasi",
    description: "Kenali lebih dekat sejarah, visi, dan misi DPM HIMA PKO.",
    icon: ShieldCheck,
    color: "bg-maroon-500",
    link: "/profil"
  },
  {
    title: "Struktur Anggota",
    description: "Daftar pengurus dan AKD periode aktif saat ini.",
    icon: Users,
    color: "bg-emerald-500",
    link: "/anggota"
  },
  {
    title: "Berita & Kegiatan",
    description: "Update terbaru seputar program kerja dan prestasi mahasiswa.",
    icon: Newspaper,
    color: "bg-amber-500",
    link: "/berita"
  },
  {
    title: "Layanan Aspirasi",
    description: "Sampaikan aspirasi dan keluhan Anda untuk PKO yang lebih baik.",
    icon: MessageSquare,
    color: "bg-purple-500",
    link: "/aspirasi"
  }
];

export default function Home() {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [bestStaff, setBestStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qNews = query(collection(db, "news"), orderBy("date", "desc"), limit(3));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setLatestNews(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    const qReward = query(collection(db, "news"), where("category", "==", "Reward"), orderBy("date", "desc"), limit(1));
    const unsubReward = onSnapshot(qReward, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setBestStaff({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-900 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-maroon-50 border border-maroon-100 text-maroon-600 text-sm font-bold mb-8"
          >
            <Trophy size={16} />
            <span>Official Website DPM HIMA PKO UPI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            Wadah Aspirasi <br className="hidden sm:block" />
            <span className="text-maroon-600">Mahasiswa PKO UPI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed px-4"
          >
            Berkomitmen untuk mewujudkan HIMA PKO yang lebih transparan, 
            aspiratif, dan berintegritas melalui fungsi legislasi, pengawasan, dan anggaran.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4"
          >
            <Link 
              to="/aspirasi" 
              className="w-full sm:w-auto px-8 py-4 bg-maroon-600 hover:bg-maroon-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-maroon-600/25 flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Sampaikan Aspirasi</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/profil" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center active:scale-95"
            >
              Tentang Kami
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-gray-200 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Layanan & Informasi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-4">
              Akses cepat ke berbagai layanan dan informasi penting seputar DPM HIMA PKO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-maroon-500/10 transition-all border border-transparent hover:border-maroon-100"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {feature.description}
                </p>
                <Link to={feature.link} className="inline-flex items-center text-maroon-600 font-bold text-sm hover:underline">
                  <span>Selengkapnya</span>
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Highlight */}
      <section className="py-16 sm:py-24 bg-maroon-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-black/5 skew-x-12 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12">
            <div className="lg:w-1/2 text-white text-center lg:text-left">
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
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] mb-8 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{bestStaff.title}</h3>
                  <p className="text-maroon-100 text-xs sm:text-sm mb-6 line-clamp-2">{bestStaff.content}</p>
                  <Link 
                    to={`/berita/${bestStaff.id}`} 
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-maroon-600 font-bold rounded-xl hover:bg-maroon-50 transition-all shadow-xl text-sm sm:text-base"
                  >
                    Lihat Selengkapnya
                  </Link>
                </div>
              ) : (
                <Link 
                  to="/berita" 
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-maroon-600 font-bold rounded-xl hover:bg-maroon-50 transition-all shadow-xl text-sm sm:text-base"
                >
                  Lihat Daftar Penerima
                </Link>
              )}
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-400 rounded-full flex items-center justify-center text-white mb-3 sm:mb-4">
                  <Trophy size={20} />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">Ketua Terbaik</h4>
                <p className="text-maroon-200 text-[10px] sm:text-sm">Kepemimpinan yang inspiratif dan visioner.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mt-6 sm:mt-8"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-400 rounded-full flex items-center justify-center text-white mb-3 sm:mb-4">
                  <Star size={20} />
                </div>
                <h4 className="text-white font-bold text-base sm:text-lg mb-1">Staff Terbaik</h4>
                <p className="text-maroon-200 text-[10px] sm:text-sm">Dedikasi tinggi dalam setiap program kerja.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 sm:mb-12">
            <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Berita Terbaru</h2>
              <p className="text-gray-600 text-sm sm:text-base">Ikuti perkembangan terbaru kegiatan dan program kerja kami.</p>
            </div>
            <Link to="/berita" className="text-maroon-600 font-bold flex items-center hover:underline text-sm sm:text-base mx-auto md:mx-0">
              Lihat Semua Berita <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news, i) => (
              <motion.div
                key={news.id}
                whileHover={{ y: -10 }}
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
              </motion.div>
            ))}
            {latestNews.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-400 text-sm">Belum ada berita terbaru.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

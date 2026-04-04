import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Newspaper, Search, Filter, Calendar, User, ArrowRight, Trophy, Star, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const categories = ["Semua", "Proker", "Reward", "Pengumuman", "Lainnya"];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "news"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      }));
      setNewsList(news);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    return () => unsubscribe();
  }, []);

  const filteredNews = newsList.filter(news => {
    const matchesCategory = selectedCategory === "Semua" || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Proker": return <Trophy size={14} />;
      case "Reward": return <Star size={14} />;
      case "Pengumuman": return <Megaphone size={14} />;
      default: return <Newspaper size={14} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Proker": return "bg-maroon-100 text-maroon-600";
      case "Reward": return "bg-amber-100 text-amber-600";
      case "Pengumuman": return "bg-emerald-100 text-emerald-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-4">
                <Newspaper size={20} />
                <span className="uppercase tracking-wider text-sm">Publikasi & Media</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Berita & Kegiatan UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Update terbaru seputar program kerja, pengumuman penting, dan apresiasi prestasi mahasiswa PKO Universitas Pendidikan Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 sticky top-20 z-30 bg-gray-50/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2",
                    selectedCategory === cat 
                      ? "bg-maroon-600 text-white shadow-lg shadow-maroon-600/20" 
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {cat !== "Semua" && getCategoryIcon(cat)}
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            {filteredNews.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col"
                  >
                    <div className="h-56 sm:h-64 relative overflow-hidden">
                      <img 
                        src={news.imageUrl} 
                        alt={news.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={cn("px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-full flex items-center space-x-1 shadow-lg", getCategoryColor(news.category))}>
                          {getCategoryIcon(news.category)}
                          <span>{news.category}</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col flex-grow">
                      <div className="flex items-center space-x-3 sm:space-x-4 text-gray-400 text-[10px] sm:text-xs font-bold mb-3 sm:mb-4 uppercase tracking-wider">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{news.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User size={12} />
                          <span>{news.author}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 group-hover:text-maroon-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6 sm:mb-8">
                        {news.content}
                      </p>
                      <div className="mt-auto">
                        <Link 
                          to={`/berita/${news.id}`} 
                          className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-900 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-maroon-600 transition-all group/btn"
                        >
                          <span>Baca Lengkap</span>
                          <ArrowRight size={14} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Newspaper size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada berita ditemukan</h3>
                <p className="text-gray-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

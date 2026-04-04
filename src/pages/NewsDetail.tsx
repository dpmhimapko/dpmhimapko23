import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Tag, Trophy, Star, Megaphone, Newspaper } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";

const mockNews = [
  { 
    id: "1", 
    title: "Sukses Gelar Rapat Kerja Tahunan Periode 2024/2025", 
    content: `DPM HIMA PKO telah melaksanakan rapat kerja untuk merumuskan program kerja strategis selama satu tahun ke depan. Kegiatan ini dihadiri oleh seluruh pengurus dan perwakilan dari HIMA PKO.

### Poin Utama Rapat Kerja:
1. **Penguatan Fungsi Legislasi**: Menyusun regulasi internal yang lebih adaptif.
2. **Optimalisasi Pengawasan**: Meningkatkan transparansi kinerja himpunan.
3. **Digitalisasi Aspirasi**: Meluncurkan platform aspirasi online.

Ketua Umum DPM HIMA PKO menyatakan bahwa tahun ini fokus utama adalah pada integritas dan keterbukaan informasi. "Kami ingin setiap mahasiswa PKO merasa memiliki wadah untuk bersuara," ujarnya.

Kegiatan ditutup dengan sesi foto bersama dan ramah tamah antar pengurus.`, 
    category: "Proker", 
    date: "12 Maret 2024", 
    imageUrl: "https://picsum.photos/seed/pko1/1200/600",
    author: "Humas DPM"
  },
  // ... other news would be fetched from DB
];

export default function NewsDetail() {
  const { id } = useParams();
  const news = mockNews.find(n => n.id === id) || mockNews[0];

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
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/berita" 
          className="inline-flex items-center text-gray-500 hover:text-maroon-600 font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
          Kembali ke Berita
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center space-x-4 mb-6">
            <span className={cn("px-4 py-1.5 text-xs font-bold rounded-full flex items-center space-x-1", getCategoryColor(news.category))}>
              {getCategoryIcon(news.category)}
              <span>{news.category}</span>
            </span>
            <div className="h-1 w-1 bg-gray-300 rounded-full" />
            <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <Calendar size={14} />
              <span>{news.date}</span>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 sm:mb-8">
            {news.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-6 border-y border-gray-100 gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-maroon-100 rounded-full flex items-center justify-center text-maroon-600 font-bold">
                {news.author.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{news.author}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">Tim Publikasi DPM</div>
              </div>
            </div>
            <button className="p-2.5 sm:p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-maroon-50 hover:text-maroon-600 transition-all self-start sm:self-auto">
              <Share2 size={18} />
            </button>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-[40px] overflow-hidden mb-12 shadow-2xl shadow-gray-200"
        >
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg prose-maroon max-w-none text-gray-700 leading-relaxed"
        >
          <div className="markdown-body">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </motion.div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <Tag size={18} className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {["DPM", "PKO", "HIMA", "Kegiatan", "Mahasiswa"].map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-maroon-50 hover:text-maroon-600 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

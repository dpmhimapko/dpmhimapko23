import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Tag, Trophy, Star, Megaphone, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";
import { db, doc, getDoc, OperationType, handleFirestoreError } from "../firebase";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getDirectDriveUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      let fileId = "";
      if (url.includes("/file/d/")) {
        fileId = url.split("/file/d/")[1].split("/")[0];
      } else if (url.includes("id=")) {
        fileId = url.split("id=")[1].split("&")[0];
      }
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
    }
    return url;
  };

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNews({
            id: docSnap.id,
            ...data,
            date: data.date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!news) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h2>
      <Link to="/berita" className="text-maroon-600 font-bold hover:underline">Kembali ke Berita</Link>
    </div>
  );

  const allImages = [news.imageUrl, ...(news.images || [])].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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
        <div
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
        </div>

        {/* Featured Image Slider */}
        <div className="relative group mb-12">
          <div
            className="rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200 aspect-video bg-gray-50 relative"
          >
            <img 
              src={getDirectDriveUrl(allImages[currentImageIndex])} 
              alt={`${news.title} - ${currentImageIndex + 1}`} 
              className="w-full h-full object-contain transition-all duration-500 relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>

          {allImages.length > 1 && (
            <>
              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      currentImageIndex === idx ? "bg-maroon-600 w-6" : "bg-gray-300"
                    )}
                  />
                ))}
              </div>

              {/* Counter */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold rounded-full border border-gray-100 shadow-sm z-20">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-maroon max-w-none text-gray-700 leading-relaxed"
        >
          <div className="markdown-body">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>

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

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, User, ArrowLeft, Share2, Tag, Trophy, Star, Megaphone, Newspaper, ChevronLeft, ChevronRight, ShieldCheck, Link2, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/src/lib/utils";
import { toast } from "react-hot-toast";
import { db, doc, getDoc, OperationType, handleFirestoreError } from "../firebase";

export default function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  const shareText = news ? `Baca berita terbaru: ${news.title}` : "Berita DPM HIMA PKO UPI";

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " - " + shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        toast.success("Link berita disalin!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin link:", err);
        toast.error("Gagal menyalin link");
      });
  };

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
      case "Reward": return <Star size={14} />;
      case "Pengumuman": return <Megaphone size={14} />;
      default: return <Newspaper size={14} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className={cn("inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-full", getCategoryColor(news.category))}>
              {getCategoryIcon(news.category)}
              <span>{news.category}</span>
            </span>
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} />
              <span>{news.date}</span>
            </div>
            <div className="hidden sm:block h-1 w-1 bg-gray-300 rounded-full" />
            <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
              <User size={14} />
              <span>Oleh: {news.author}</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-[1.15] mb-8">
            {news.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-gray-100 gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-maroon-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-maroon-600/20">
                  {news.author.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                  <ShieldCheck size={14} className="text-maroon-600" />
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">{news.author}</div>
                <div className="text-xs text-gray-500 font-medium tracking-wide">Tim Publikasi DPM HIMA PKO</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 relative">
              <div className="text-right hidden sm:block mr-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estimasi Baca</div>
                <div className="text-xs font-bold text-gray-900">{Math.ceil((news.content?.length || 0) / 1000)} Menit</div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-maroon-50 hover:text-maroon-600 transition-all font-bold text-sm active:scale-95 duration-200"
                >
                  <Share2 size={18} />
                  <span>Bagikan</span>
                </button>

                <AnimatePresence>
                  {showShareMenu && (
                    <>
                      {/* Backdrop to close the menu on click */}
                      <div 
                        className="fixed inset-0 z-40 cursor-default" 
                        onClick={() => setShowShareMenu(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 z-50 origin-top-right overflow-hidden border border-gray-100"
                      >
                        <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                          Bagikan Berita
                        </div>
                        
                        <a 
                          href={shareLinks.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShareMenu(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all font-bold"
                        >
                          <span className="text-emerald-500">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.8.48 3.48 1.32 4.92L2 22l5.28-1.32c1.38.78 2.94 1.32 4.72 1.32 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.76 13.92c-.24.72-1.2 1.32-1.92 1.56-.6.12-1.32.24-3.6-.72-2.88-1.2-4.68-4.08-4.8-4.32-.12-.24-1.08-1.44-1.08-2.76s.66-2.04.9-2.28c.24-.24.48-.36.72-.36h.48c.12 0 .36 0 .48.36.12.36.6 1.56.66 1.68.06.12.12.24 0 .48-.06.24-.18.36-.36.6-.18.24-.36.36-.54.6-.18.18-.36.42-.12.78.24.42.96 1.62 2.04 2.58 1.44 1.32 2.64 1.68 3 1.86.36.18.6 0 .78-.18.24-.24.9-1.08 1.14-1.44.24-.36.48-.3.78-.18.3.12 1.92.9 2.22 1.08.3.18.48.3.54.42.12.36.12 1.08-.12 1.8z"/>
                            </svg>
                          </span>
                          <span>WhatsApp</span>
                        </a>

                        <a 
                          href={shareLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShareMenu(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all font-bold"
                        >
                          <span className="text-gray-900 bg-gray-50 p-0.5 rounded-md">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </span>
                          <span>Twitter / X</span>
                        </a>

                        <a 
                          href={shareLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShareMenu(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold"
                        >
                          <span className="text-blue-600">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                            </svg>
                          </span>
                          <span>Facebook</span>
                        </a>

                        <button 
                          onClick={() => {
                            handleCopyLink();
                            setShowShareMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:text-maroon-600 hover:bg-maroon-50 rounded-xl transition-all font-bold"
                        >
                          <span className="text-maroon-600">
                            {copied ? <Check size={18} /> : <Link2 size={18} />}
                          </span>
                          <span>{copied ? "Disalin!" : "Salin Link"}</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Slider */}
        <div className="relative group mb-14">
          <div
            className="rounded-3xl sm:rounded-[48px] overflow-hidden shadow-2xl shadow-maroon-900/5 aspect-video bg-gray-50 relative border border-gray-100"
          >
            <img 
              src={getDirectDriveUrl(allImages[currentImageIndex])} 
              alt={`${news.title} - ${currentImageIndex + 1}`} 
              className="w-full h-full object-cover sm:object-contain relative z-10"
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
          className="prose prose-lg prose-maroon max-w-none text-gray-800 leading-[1.8] whitespace-pre-wrap sm:whitespace-normal"
        >
          <div className="markdown-body">
            <ReactMarkdown>{news.content}</ReactMarkdown>
          </div>
        </div>

        {/* Tags and Footer */}
        <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
              <Tag size={18} />
            </div>
            <div className="flex flex-wrap gap-2">
              {["DPM HIMA PKO", news.category, "HIMA PKO UPI"].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-maroon-600 hover:text-white transition-all cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Share:</span>
            <div className="flex items-center space-x-2">
              <a 
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                title="Bagikan ke WhatsApp"
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-gray-100"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.8.48 3.48 1.32 4.92L2 22l5.28-1.32c1.38.78 2.94 1.32 4.72 1.32 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.76 13.92c-.24.72-1.2 1.32-1.92 1.56-.6.12-1.32.24-3.6-.72-2.88-1.2-4.68-4.08-4.8-4.32-.12-.24-1.08-1.44-1.08-2.76s.66-2.04.9-2.28c.24-.24.48-.36.72-.36h.48c.12 0 .36 0 .48.36.12.36.6 1.56.66 1.68.06.12.12.24 0 .48-.06.24-.18.36-.36.6-.18.24-.36.36-.54.6-.18.18-.36.42-.12.78.24.42.96 1.62 2.04 2.58 1.44 1.32 2.64 1.68 3 1.86.36.18.6 0 .78-.18.24-.24.9-1.08 1.14-1.44.24-.36.48-.3.78-.18.3.12 1.92.9 2.22 1.08.3.18.48.3.54.42.12.36.12 1.08-.12 1.8z"/>
                </svg>
              </a>

              <a 
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Bagikan ke Twitter / X"
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-gray-100"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a 
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Bagikan ke Facebook"
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-gray-100"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>

              <button 
                onClick={handleCopyLink}
                title="Salin Link Berita"
                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-maroon-50 hover:text-maroon-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-gray-100"
              >
                {copied ? <Check size={18} className="text-maroon-600" /> : <Link2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

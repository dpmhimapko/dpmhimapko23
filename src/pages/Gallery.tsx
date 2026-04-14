import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Play, Search, Filter, Maximize2, Calendar, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const types = ["Semua", "Foto", "Video"];

export default function Gallery() {
  const [selectedType, setSelectedType] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const q = query(collection(db, "gallery"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
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
      });
      setGalleryList(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "gallery");
    });

    return () => unsubscribe();
  }, []);

  const filteredGallery = galleryList.filter(item => {
    const matchesType = selectedType === "Semua" || 
                       (selectedType === "Foto" && item.type === "photo") || 
                       (selectedType === "Video" && item.type === "video");
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-4">
                <ImageIcon size={20} />
                <span className="uppercase tracking-wider text-sm">Dokumentasi Visual</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Galeri Kegiatan UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Kumpulan momen berharga dan dokumentasi kegiatan DPM HIMA PKO Universitas Pendidikan Indonesia dalam bentuk foto dan video.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section 
        className="py-8 sticky top-20 z-30 bg-gray-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Type Tabs */}
            <div className="w-full lg:w-auto -mx-4 px-4 sm:mx-0 sm:px-0 overflow-hidden relative scroll-fade-right">
              <div className="flex items-center space-x-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x snap-mandatory">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "px-8 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 snap-start",
                      selectedType === type 
                        ? "bg-maroon-600 text-white shadow-lg shadow-maroon-600/20" 
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {type === "Foto" && <ImageIcon size={14} />}
                    {type === "Video" && <Play size={14} />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari dokumentasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredGallery.length > 0 ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setCurrentImageIndex(0);
                  }}
                  className="group bg-white rounded-[32px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
                >
                  <div className="aspect-video sm:aspect-square relative overflow-hidden bg-gray-100">
                    <img 
                      src={item.type === "photo" ? getDirectDriveUrl(item.url) : getDirectDriveUrl(item.thumbnailUrl)} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center space-x-1">
                        {item.type === "photo" ? <ImageIcon size={10} /> : <Play size={10} />}
                        <span>{item.type === "photo" ? "Foto" : "Video"}</span>
                      </span>
                    </div>

                    {/* Hover Play/Expand Icon */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        {item.type === "photo" ? <Maximize2 size={24} /> : <Play size={24} className="fill-white" />}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-gray-900 font-bold text-sm sm:text-base leading-tight mb-2 line-clamp-2 group-hover:text-maroon-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <Calendar size={12} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <ImageIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada dokumentasi ditemukan</h3>
              <p className="text-gray-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full flex items-center justify-center transition-colors z-50 shadow-sm"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-full border border-gray-100">
                <div className="flex-grow overflow-hidden flex items-center justify-center bg-gray-50 relative min-h-[300px]">
                  {selectedItem.type === "photo" ? (
                    <>
                      {(() => {
                        const allImages = [selectedItem.url, ...(selectedItem.images || [])].filter(Boolean);
                        return (
                          <>
                            <img 
                              src={getDirectDriveUrl(allImages[currentImageIndex])} 
                              alt={selectedItem.title} 
                              className="max-w-full max-h-full object-contain transition-all duration-500 relative z-10"
                              referrerPolicy="no-referrer"
                            />
                            
                            {allImages.length > 1 && (
                              <>
                                <button 
                                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center transition-all z-20"
                                >
                                  <ChevronLeft size={24} />
                                </button>
                                <button 
                                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg hover:bg-gray-50 text-gray-900 rounded-full flex items-center justify-center transition-all z-20"
                                >
                                  <ChevronRight size={24} />
                                </button>

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

                                <div className="absolute top-6 right-6 px-3 py-1 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold rounded-full border border-gray-100 shadow-sm z-20">
                                  {currentImageIndex + 1} / {allImages.length}
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <iframe
                      src={selectedItem.url}
                      className="w-full aspect-video"
                      title={selectedItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-6 sm:p-8 bg-white text-gray-900 border-t border-gray-50">
                  <div className="flex items-center space-x-3 text-maroon-600 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedItem.type === "photo" ? <ImageIcon size={14} /> : <Play size={14} />}
                    <span>{selectedItem.type === "photo" ? "Foto Dokumentasi" : "Video Dokumentasi"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2 text-gray-900">{selectedItem.title}</h2>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
                    <Calendar size={14} />
                    <span>Diunggah pada {selectedItem.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Play, Search, Filter, Maximize2, Calendar, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const types = ["Semua", "Foto", "Video"];

export default function Gallery() {
  const [selectedType, setSelectedType] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      }));
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
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="py-8 sticky top-20 z-30 bg-gray-50/80 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Type Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "px-8 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2",
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
      </motion.section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            {filteredGallery.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredGallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedItem(item)}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    className="group relative aspect-square rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gray-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all"
                  >
                    <img 
                      src={item.type === "photo" ? item.url : item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-4 sm:p-6">
                      <div className="flex items-center space-x-2 text-maroon-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2">
                        {item.type === "photo" ? <ImageIcon size={12} /> : <Play size={12} />}
                        <span>{item.type === "photo" ? "Foto" : "Video"}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm sm:text-lg leading-tight mb-1 sm:mb-2">{item.title}</h3>
                      <div className="flex items-center space-x-2 text-white/60 text-[10px] sm:text-xs">
                        <Calendar size={10} />
                        <span>{item.date}</span>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300">
                        {item.type === "photo" ? <Maximize2 size={20} /> : <Play size={20} className="fill-white" />}
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
                  <ImageIcon size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada dokumentasi ditemukan</h3>
                <p className="text-gray-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
              onClick={() => setSelectedItem(null)}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full">
                <div className="flex-grow overflow-hidden flex items-center justify-center bg-black min-h-[300px]">
                  {selectedItem.type === "photo" ? (
                    <img 
                      src={selectedItem.url} 
                      alt={selectedItem.title} 
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
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
                <div className="p-6 sm:p-8 bg-gray-900 text-white">
                  <div className="flex items-center space-x-3 text-maroon-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedItem.type === "photo" ? <ImageIcon size={14} /> : <Play size={14} />}
                    <span>{selectedItem.type === "photo" ? "Foto Dokumentasi" : "Video Dokumentasi"}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2">{selectedItem.title}</h2>
                  <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm">
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

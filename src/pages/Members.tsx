import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Filter, Search, Award, ShieldCheck, Target, X, Instagram, GraduationCap, Fingerprint, Quote } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const periods = ["Semua", "2025", "2024/2025", "2023/2024"];
const akds = ["Semua", "Pengurus Harian", "Komisi", "Humas", "Legislasi", "PSDM"];

const divisionGroupPhotos: Record<string, string> = {
  "Komisi": "https://drive.google.com/thumbnail?id=1KI-VGG-6ehvAKqA1GDDOCKQDwJYIEjgZ&sz=w1000",
  "Pengurus Harian": "https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000", // Placeholder or actual if available
};

export default function Members() {
  const [selectedPeriod, setSelectedPeriod] = useState("Semua");
  const [selectedAkd, setSelectedAkd] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [memberList, setMemberList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);

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
    const q = query(collection(db, "members"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemberList(members);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "members");
    });

    return () => unsubscribe();
  }, []);

  const filteredMembers = memberList.filter(member => {
    const matchesPeriod = selectedPeriod === "Semua" || member.period === selectedPeriod;
    const matchesAkd = selectedAkd === "Semua" || member.akd === selectedAkd;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesAkd && matchesSearch;
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
                <Users size={20} />
                <span className="uppercase tracking-wider text-sm">Struktur Organisasi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Anggota & AKD UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Daftar pengurus DPM HIMA PKO Universitas Pendidikan Indonesia yang berdedikasi menjalankan amanah mahasiswa.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-4 w-full sm:w-auto"
            >
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-gray-100 border-none rounded-2xl px-6 py-3 pr-12 font-bold text-gray-900 focus:ring-2 focus:ring-maroon-600 outline-none cursor-pointer w-full"
                >
                  {periods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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
            {/* AKD Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto scrollbar-hide">
              {akds.map((akd) => (
                <button
                  key={akd}
                  onClick={() => setSelectedAkd(akd)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                    selectedAkd === akd 
                      ? "bg-maroon-600 text-white shadow-lg shadow-maroon-600/20" 
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {akd}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Division Group Photo */}
      <AnimatePresence mode="wait">
        {selectedAkd !== "Semua" && divisionGroupPhotos[selectedAkd] && (
          <motion.section 
            key={`group-photo-${selectedAkd}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl aspect-[16/9] sm:aspect-[21/9] bg-gray-200 group">
                <img 
                  src={getDirectDriveUrl(divisionGroupPhotos[selectedAkd])} 
                  alt={`Foto Barengan ${selectedAkd}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-12">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-maroon-600/20 backdrop-blur-md border border-maroon-400/30 rounded-full text-maroon-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4">
                        <Users size={12} />
                        <span>Keluarga Besar</span>
                      </div>
                      <h2 className="text-3xl sm:text-6xl font-black text-white mb-4 leading-tight">
                        Divisi {selectedAkd}
                      </h2>
                      <p className="text-white/70 text-sm sm:text-lg font-medium leading-relaxed">
                        Sinergi dan dedikasi dalam menjalankan amanah untuk kemajuan mahasiswa PKO UPI.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Members Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-maroon-200 border-t-maroon-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat data anggota...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMembers.length > 0 ? (
                <motion.div 
                  layout
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
                >
                  {filteredMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                      onClick={() => setSelectedMember(member)}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 cursor-pointer"
                    >
                      <div className="h-48 sm:h-72 relative overflow-hidden bg-gray-100">
                        <img 
                          src={getDirectDriveUrl(member.photoUrl)} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                          style={{ opacity: 0, transition: 'opacity 0.3s' }}
                        />
                        <motion.div 
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity flex items-end p-3 sm:p-6"
                        >
                          <div className="text-white">
                            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-maroon-400 mb-1">{member.akd}</div>
                            <div className="text-[10px] sm:text-sm font-medium text-white/80">{member.period}</div>
                          </div>
                        </motion.div>
                      </div>
                      <div className="p-3 sm:p-6 text-center">
                        <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-0">{member.name}</h3>
                        <p className="text-maroon-600 font-bold text-[10px] sm:text-sm mb-3 sm:mb-4 line-clamp-1">{member.role}</p>
                        <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                          {member.instagram ? (
                            <a 
                              href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 sm:bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer"
                            >
                              <Instagram size={12} className="sm:w-[14px] sm:h-[14px]" />
                            </a>
                          ) : (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 sm:bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                              <ShieldCheck size={12} className="sm:w-[14px] sm:h-[14px]" />
                            </div>
                          )}
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 sm:bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                            <Target size={12} className="sm:w-[14px] sm:h-[14px]" />
                          </div>
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 sm:bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                            <Award size={12} className="sm:w-[14px] sm:h-[14px]" />
                          </div>
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
                    <Users size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada anggota ditemukan</h3>
                  <p className="text-gray-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white md:text-gray-400 md:bg-gray-100 md:hover:bg-gray-200 transition-all"
              >
                <X size={20} />
              </button>

              {/* Photo Section */}
              <div className="w-full md:w-2/5 h-72 md:h-auto relative">
                <img 
                  src={getDirectDriveUrl(selectedMember.photoUrl)} 
                  alt={selectedMember.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                <div className="absolute bottom-6 left-6 text-white md:hidden">
                  <h2 className="text-2xl font-bold mb-1">{selectedMember.name}</h2>
                  <p className="text-maroon-400 font-bold">{selectedMember.role}</p>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 overflow-y-auto max-h-[60vh] md:max-h-none">
                <div className="hidden md:block mb-8">
                  <div className="inline-block px-4 py-1.5 bg-maroon-50 text-maroon-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    {selectedMember.akd} • {selectedMember.period}
                  </div>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{selectedMember.name}</h2>
                  <p className="text-maroon-600 font-bold text-lg">{selectedMember.role}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-maroon-600 shrink-0">
                      <Fingerprint size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">NIM</div>
                      <div className="text-gray-900 font-bold">{selectedMember.nim || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-maroon-600 shrink-0">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Angkatan</div>
                      <div className="text-gray-900 font-bold">{selectedMember.batch || "-"}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center space-x-2 text-gray-400 mb-3">
                    <Quote size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Bio / Motto</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{selectedMember.bio || "Dedikasi untuk kemajuan mahasiswa PKO UPI."}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {selectedMember.instagram && (
                      <a 
                        href={`https://instagram.com/${selectedMember.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-gray-600 hover:text-maroon-600 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-gray-50 group-hover:bg-maroon-50 rounded-xl flex items-center justify-center transition-colors">
                          <Instagram size={20} />
                        </div>
                        <span className="font-bold">{selectedMember.instagram}</span>
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={20} className="text-maroon-600" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verified Member</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

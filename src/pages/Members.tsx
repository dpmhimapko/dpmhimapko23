import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Filter, Search, Instagram, GraduationCap, Fingerprint, Quote, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const periods = ["Semua", "2025", "2024/2025", "2023/2024"];
const akds = ["BPH", "Komisi", "Humas", "Legislasi", "PSDM"];

const akdDescriptions: Record<string, string> = {
  "BPH": "Badan Pengurus Harian (BPH) merupakan inti dari kepengurusan DPM HIMA PKO yang bertanggung jawab penuh dalam mengoordinasikan, mengarahkan, dan mengontrol jalannya roda organisasi secara keseluruhan demi tercapainya visi dan misi lembaga.",
  "Komisi": "Komisi memiliki peran vital dalam menjalankan fungsi pengawasan terhadap kinerja eksekutif, serta bertanggung jawab dalam proses legislasi dan penganggaran di lingkungan mahasiswa PKO.",
  "Humas": "Divisi Hubungan Masyarakat (Humas) bertugas sebagai garda terdepan dalam membangun relasi positif, mengelola informasi publik, dan menjadi jembatan komunikasi antara DPM dengan pihak internal maupun eksternal.",
  "Legislasi": "Divisi Legislasi berfokus pada penyusunan hukum dan produk peraturan organisasi, memastikan setiap landasan operasional DPM sesuai dengan aturan yang berlaku dan aspirasi mahasiswa.",
  "PSDM": "Pengembangan Sumber Daya Mahasiswa (PSDM) berfokus pada upaya peningkatan kompetensi, karakter, dan produktivitas anggota guna mencetak kader-kader pemimpin yang berkualitas di masa depan."
};

const divisionGroupPhotos: Record<string, string> = {
  "Komisi": "https://drive.google.com/thumbnail?id=1KI-VGG-6ehvAKqA1GDDOCKQDwJYIEjgZ&sz=w1000",
  "BPH": "https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000",
};

export default function Members() {
  const [selectedPeriod, setSelectedPeriod] = useState("Semua");
  const [selectedAkd, setSelectedAkd] = useState("BPH");
  const [searchQuery, setSearchQuery] = useState("");
  const [memberList, setMemberList] = useState<any[]>([]);
  const [divisionsData, setDivisionsData] = useState<any[]>([]);
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
    const unsubscribeMembers = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMemberList(members);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "members");
    });

    const unsubscribeDivisions = onSnapshot(collection(db, "divisions"), (snapshot) => {
      const divData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDivisionsData(divData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "divisions");
    });

    return () => {
      unsubscribeMembers();
      unsubscribeDivisions();
    };
  }, []);

  const getDivisionInfo = (akdName: string) => {
    const dynamicInfo = divisionsData.find(d => d.name === akdName);
    return {
      description: dynamicInfo?.description || akdDescriptions[akdName] || "Sinergi dan dedikasi dalam menjalankan amanah mahasiswa PKO UPI untuk menciptakan lingkungan akademis yang aspiratif dan kolaboratif.",
      photoUrl: dynamicInfo?.photoUrl || divisionGroupPhotos[akdName] || ""
    };
  };

  const filteredMembers = memberList.filter(member => {
    const matchesPeriod = selectedPeriod === "Semua" || member.period === selectedPeriod;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-4">
                <Users size={20} />
                <span className="uppercase tracking-wider text-sm">Struktur Organisasi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Anggota & AKD UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Daftar pengurus DPM HIMA PKO Universitas Pendidikan Indonesia yang berdedikasi menjalankan amanah mahasiswa.
              </p>
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto">
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
            </div>
          </div>
        </div>
      </section>

      {/* Premium AKD Navigation */}
      <section 
        className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* AKD Selector */}
            <div className="flex items-center space-x-6 sm:space-x-12 overflow-x-auto scrollbar-hide py-2">
              {akds.map((akd) => (
                <button
                  key={akd}
                  onClick={() => {
                    setSelectedAkd(akd);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative py-2 group whitespace-nowrap"
                >
                  <span className={cn(
                    "text-xs sm:text-sm font-black uppercase tracking-[0.2em] transition-all duration-300",
                    selectedAkd === akd ? "text-maroon-600" : "text-gray-400 group-hover:text-gray-600"
                  )}>
                    {akd}
                  </span>
                  {selectedAkd === akd && (
                    <motion.div 
                      layoutId="activeAkd"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-maroon-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* In-Nav Search - Subtle icon only on mobile, bar on desktop */}
            <div className="relative ml-4 shrink-0">
              <div className="hidden sm:block relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari anggota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-maroon-600 outline-none transition-all w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-12 sm:py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-maroon-200 border-t-maroon-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedAkd + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Intro Card for Selected AKD */}
                {!searchQuery && (
                  <div className="mb-20">
                    <div className="bg-white rounded-[32px] sm:rounded-[48px] overflow-hidden shadow-2xl shadow-maroon-900/5 border border-gray-100 flex flex-col md:flex-row min-h-[400px]">
                      <div className="w-full md:w-1/3 h-auto aspect-[4/5] md:aspect-auto relative overflow-hidden group border-b md:border-b-0 md:border-r border-gray-100">
                        {getDivisionInfo(selectedAkd).photoUrl ? (
                          <img 
                            src={getDirectDriveUrl(getDivisionInfo(selectedAkd).photoUrl)} 
                            alt={`Foto Barengan ${selectedAkd}`}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center p-12 text-center" style={{ backgroundColor: '#f9fafb' }}>
                            <div className="flex flex-col items-center">
                              <Users size={64} className="text-gray-200 mb-4" />
                              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Foto Belum Tersedia</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-2/3 p-6 sm:p-16 flex flex-col justify-center">
                        <div className="inline-flex items-center space-x-3 px-4 py-2 bg-gray-100 text-gray-600 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 w-fit">
                          <Users size={14} />
                          <span>Profil AKD</span>
                        </div>
                        
                        <h2 className="text-3xl sm:text-6xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight lowercase first-letter:uppercase">
                          {selectedAkd === "BPH" ? "Badan Pengurus Harian" : selectedAkd}
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="w-12 h-1.5 bg-maroon-600 rounded-full" />
                          <p className="text-gray-600 text-sm sm:text-xl font-medium leading-relaxed max-w-2xl text-justify">
                            {getDivisionInfo(selectedAkd).description}
                          </p>
                        </div>

                        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-8">
                          <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 text-[8px] sm:text-[10px]">Total Personel</div>
                            <div className="text-2xl sm:text-3xl font-medium text-gray-600">
                              {memberList.filter(m => {
                                const mAkd = m.akd === "Pengurus Harian" ? "BPH" : m.akd;
                                return mAkd === selectedAkd;
                              }).length}
                            </div>
                          </div>
                          <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-100">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2 text-[8px] sm:text-[10px]">Status</div>
                            <div className="text-lg sm:text-xl font-medium text-gray-600">Aktif</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Grid */}
                <div>
                  {!searchQuery && (
                    <div className="flex items-center space-x-4 mb-10">
                      <div className="h-px flex-1 bg-gray-100" />
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Anggota & Struktural</span>
                      <div className="h-px flex-1 bg-gray-100" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                    {filteredMembers
                      .filter(m => {
                        if (searchQuery) return true;
                        const mAkd = m.akd === "Pengurus Harian" ? "BPH" : m.akd;
                        return mAkd === selectedAkd;
                      })
                      .map((member) => (
                        <div
                          key={member.id}
                          onClick={() => setSelectedMember(member)}
                          className="group bg-white rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 cursor-pointer"
                        >
                          <div className="h-48 sm:h-72 relative overflow-hidden bg-gray-100">
                            <img 
                              src={getDirectDriveUrl(member.photoUrl)} 
                              alt={member.name} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="p-3 sm:p-6 text-center">
                            <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-0">{member.name}</h3>
                            <p className="text-maroon-600 font-bold text-[10px] sm:text-sm mb-3 sm:mb-4 line-clamp-1">{member.role}</p>
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                              {member.instagram && (
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-maroon-600 group-hover:text-white transition-colors">
                                  <Instagram size={12} className="sm:w-[14px] sm:h-[14px]" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {filteredMembers.filter(m => {
                    if (searchQuery) return true;
                    const mAkd = m.akd === "Pengurus Harian" ? "BPH" : m.akd;
                    return mAkd === selectedAkd;
                  }).length === 0 && !loading && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <Users size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada data ditemukan</h3>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

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
              </div>

              {/* Content Section */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 overflow-y-auto max-h-[60vh] md:max-h-none">
                <div className="hidden md:block mb-8">
                  <div className="inline-block px-4 py-1.5 bg-maroon-50 text-maroon-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    {(selectedMember.akd === "Pengurus Harian" || selectedMember.akd === "BPH") ? "Badan Pengurus Harian" : selectedMember.akd} • {selectedMember.period}
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
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

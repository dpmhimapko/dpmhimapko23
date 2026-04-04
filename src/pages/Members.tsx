import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Filter, Search, Award, ShieldCheck, Target } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, collection, query, orderBy, onSnapshot, OperationType, handleFirestoreError } from "../firebase";

const periods = ["2025", "2024/2025", "2023/2024"];
const akds = ["Semua", "Pengurus Harian", "Komisi", "Humas", "Legislasi", "PSDM"];

export default function Members() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025");
  const [selectedAkd, setSelectedAkd] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [memberList, setMemberList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const matchesPeriod = member.period === selectedPeriod;
    const matchesAkd = selectedAkd === "Semua" || member.akd === selectedAkd;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesAkd && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white border-b border-gray-100">
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

      {/* Filters & Search */}
      <section className="py-8 sticky top-20 z-30 bg-gray-50/80 backdrop-blur-md">
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
      </section>

      {/* Members Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            {filteredMembers.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100"
                  >
                    <div className="h-64 sm:h-72 relative overflow-hidden">
                      <img 
                        src={member.photoUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 sm:p-6">
                        <div className="text-white">
                          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-maroon-400 mb-1">{member.akd}</div>
                          <div className="text-xs sm:text-sm font-medium text-white/80">{member.period}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6 text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-maroon-600 font-bold text-xs sm:text-sm mb-4">{member.role}</p>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                          <ShieldCheck size={14} />
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                          <Target size={14} />
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-maroon-600 hover:text-white transition-colors cursor-pointer">
                          <Award size={14} />
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
        </div>
      </section>
    </div>
  );
}

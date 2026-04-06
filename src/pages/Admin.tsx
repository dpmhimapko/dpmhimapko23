import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Users, Newspaper, Image as ImageIcon, 
  MessageSquare, Settings, LogOut, Plus, Edit2, Trash2, 
  Search, Filter, ChevronRight, CheckCircle2, AlertCircle,
  ShieldCheck, Trophy, Star, Megaphone
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { db, auth, signOut, collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc, addDoc, OperationType, handleFirestoreError, writeBatch } from "../firebase";
import { useAuth } from "../FirebaseProvider";
import toast from "react-hot-toast";

const tabs = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "news", name: "Berita", icon: Newspaper },
  { id: "members", name: "Anggota", icon: Users },
  { id: "gallery", name: "Galeri", icon: ImageIcon },
  { id: "aspirations", name: "Aspirasi", icon: MessageSquare },
  { id: "settings", name: "Pengaturan", icon: Settings },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [news, setNews] = useState<any[]>([]);
  const [aspirations, setAspirations] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [filterDivision, setFilterDivision] = useState("Semua");
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"news" | "members" | "gallery" | "aspirations" | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

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
    if (!authLoading && (!user || role !== 'admin')) {
      navigate("/login");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (role !== 'admin') return;

    const unsubNews = onSnapshot(query(collection(db, "news"), orderBy("date", "desc")), (snap) => {
      setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "news");
    });

    const unsubAspirations = onSnapshot(query(collection(db, "aspirations"), orderBy("date", "desc")), (snap) => {
      setAspirations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "aspirations");
    });

    const unsubMembers = onSnapshot(query(collection(db, "members"), orderBy("order", "asc")), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "members");
    });

    const unsubGallery = onSnapshot(query(collection(db, "gallery"), orderBy("date", "desc")), (snap) => {
      setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "gallery");
    });

    return () => {
      unsubNews();
      unsubAspirations();
      unsubMembers();
      unsubGallery();
    };
  }, [role]);

  const handleOpenModal = (type: any, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      // Convert Firestore timestamp to string for date input if needed
      const data = { ...item };
      if (data.date && typeof data.date.toDate === 'function') {
        data.date = data.date.toDate().toISOString().split('T')[0];
      }
      setFormData(data);
    } else {
      setFormData(type === 'news' ? { date: new Date().toISOString().split('T')[0] } : {});
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalType) return;
    
    setIsSubmitting(true);
    try {
      const dataToSave = { ...formData };
      
      // Auto-convert Drive URLs
      if (dataToSave.photoUrl) dataToSave.photoUrl = getDirectDriveUrl(dataToSave.photoUrl);
      if (dataToSave.imageUrl) dataToSave.imageUrl = getDirectDriveUrl(dataToSave.imageUrl);
      if (dataToSave.url) dataToSave.url = getDirectDriveUrl(dataToSave.url);
      if (dataToSave.thumbnailUrl) dataToSave.thumbnailUrl = getDirectDriveUrl(dataToSave.thumbnailUrl);

      // Remove id if present as it's not a field in the document
      if ('id' in dataToSave) {
        delete dataToSave.id;
      }
      
      // Convert date string back to Date object if present
      if (dataToSave.date && typeof dataToSave.date === 'string') {
        dataToSave.date = new Date(dataToSave.date);
      }

      if (editingItem) {
        if (modalType === 'news' && !dataToSave.authorUid) {
          dataToSave.authorUid = user?.uid;
        }
        await updateDoc(doc(db, modalType, editingItem.id), dataToSave);
        toast.success("Data berhasil diperbarui");
      } else {
        // Add default fields for new items
        if (modalType === 'news') {
          dataToSave.author = user?.displayName || "Admin";
          dataToSave.authorUid = user?.uid;
        }
        if (modalType === 'members' && !dataToSave.order) {
          dataToSave.order = members.length + 1;
        }
        
        await addDoc(collection(db, modalType), dataToSave);
        toast.success("Data berhasil ditambahkan");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal menyimpan data");
      handleFirestoreError(error, editingItem ? OperationType.UPDATE : OperationType.CREATE, modalType);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    try {
      await deleteDoc(doc(db, coll, id));
      toast.success("Data berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus data");
      handleFirestoreError(error, OperationType.DELETE, coll);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal keluar");
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-72" : "w-0 lg:w-20 overflow-hidden"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-white/10 p-1">
              <img 
                src="https://drive.google.com/thumbnail?id=1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z&sz=w1000" 
                alt="DPM HIMA PKO Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col whitespace-nowrap">
                <span className="font-bold text-lg leading-none">Admin Panel</span>
                <span className="text-xs text-maroon-400">DPM HIMA PKO</span>
              </div>
            )}
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <ChevronRight className="rotate-180" />
          </button>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all group",
                  isActive 
                    ? "bg-maroon-600 text-white shadow-lg shadow-maroon-600/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={20} className={cn("shrink-0", isActive ? "text-white" : "group-hover:text-maroon-400")} />
                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{tab.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group",
            )}
          >
            <LogOut size={20} className="shrink-0 group-hover:rotate-180 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm tracking-wide">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-grow transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        )}
      >
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <ChevronRight className={cn("transition-transform", isSidebarOpen ? "rotate-180" : "rotate-0")} />
            </button>
            <h2 className="text-base sm:text-xl font-extrabold text-gray-900 capitalize truncate max-w-[120px] sm:max-w-none">{activeTab}</h2>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-bold text-gray-900">Admin Utama</span>
              <span className="text-xs text-emerald-500 font-bold flex items-center justify-end">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
                Online
              </span>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
              <img src="https://i.pravatar.cc/100?u=admin" alt="Admin" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8 flex-grow">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Berita", value: news.length.toString(), icon: Newspaper, color: "text-maroon-600", bg: "bg-maroon-50" },
                    { label: "Total Anggota", value: members.length.toString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Aspirasi Baru", value: aspirations.filter(a => a.status === 'pending').length.toString(), icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Galeri Media", value: gallery.length.toString(), icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-50" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Aspirations */}
                <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Aspirasi Terbaru</h3>
                    <button onClick={() => setActiveTab("aspirations")} className="text-maroon-600 text-sm font-bold hover:underline">Lihat Semua</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {aspirations.slice(0, 5).map((asp) => (
                      <div key={asp.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex items-start justify-between">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                            <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1 truncate">{asp.category}</h4>
                            <p className="text-gray-500 text-[10px] sm:text-xs line-clamp-1 mb-2">{asp.message}</p>
                            <div className="flex items-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full",
                                asp.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                              )}>{asp.status}</span>
                              <span className="text-gray-400">{asp.date?.toDate().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab("aspirations")} className="p-2 text-gray-400 hover:text-maroon-600 transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    ))}
                    {aspirations.length === 0 && (
                      <div className="p-12 text-center text-gray-400 text-sm">Belum ada aspirasi masuk.</div>
                    )}
                  </div>
                </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-8">Aksi Cepat</h3>
                    <div className="space-y-4">
                      <button 
                        onClick={() => handleOpenModal('news')}
                        className="w-full flex items-center justify-between p-4 bg-maroon-50 text-maroon-600 rounded-2xl hover:bg-maroon-100 transition-all font-bold text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus size={18} />
                          <span>Tambah Berita</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('members')}
                        className="w-full flex items-center justify-between p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all font-bold text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus size={18} />
                          <span>Tambah Anggota</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal('gallery')}
                        className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-all font-bold text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Plus size={18} />
                          <span>Upload Galeri</span>
                        </div>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    <div className="mt-12 p-6 bg-gray-900 rounded-3xl text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <ShieldCheck size={24} className="text-maroon-400 mb-4" />
                      <h4 className="font-bold text-sm mb-2">Keamanan Sistem</h4>
                      <p className="text-white/60 text-[10px] leading-relaxed">
                        Selalu ingat untuk keluar dari dashboard setelah selesai mengelola konten.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berita..."
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => handleOpenModal('news')}
                    className="px-8 py-3.5 bg-maroon-600 text-white font-bold rounded-2xl hover:bg-maroon-700 transition-all shadow-lg shadow-maroon-600/20 flex items-center justify-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Buat Berita Baru</span>
                  </button>
                </div>

                <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Berita</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {news.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                  <img src={getDirectDriveUrl(item.imageUrl)} alt="News" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-maroon-50 text-maroon-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{item.category}</span>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">{item.date?.toDate().toLocaleDateString()}</td>
                            <td className="px-8 py-6">
                              <span className="flex items-center text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                                Published
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleOpenModal('news', item)}
                                  className="p-2 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete("news", item.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-50">
                    {news.map((item) => (
                      <div key={item.id} className="p-6 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                            <img src={getDirectDriveUrl(item.imageUrl)} alt="News" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{item.title}</h4>
                            <span className="px-2 py-0.5 bg-maroon-50 text-maroon-600 text-[9px] font-bold rounded-full uppercase tracking-wider">{item.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-[10px] text-gray-500 font-medium">{item.date?.toDate().toLocaleDateString()}</div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleOpenModal('news', item)}
                              className="p-2.5 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-xl"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete("news", item.id)} className="p-2.5 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-xl">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {news.length === 0 && (
                    <div className="px-8 py-12 text-center text-gray-400 text-sm">Belum ada berita.</div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Aspirations Tab */}
            {activeTab === "aspirations" && (
              <motion.div
                key="aspirations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Manajemen Aspirasi</h2>
                    <p className="text-gray-500 text-sm">Kelola dan tanggapi aspirasi dari mahasiswa PKO.</p>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Pesan</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {aspirations.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                  <MessageSquare size={16} />
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{item.category}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <p className="text-gray-500 text-sm line-clamp-1 max-w-xs">{item.message}</p>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">{item.date?.toDate().toLocaleDateString()}</td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider",
                                item.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                              )}>{item.status}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleOpenModal('aspirations', item)}
                                  className="p-2 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete("aspirations", item.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-50">
                    {aspirations.map((item) => (
                      <div key={item.id} className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              <MessageSquare size={16} />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">{item.category}</span>
                          </div>
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider",
                            item.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                          )}>{item.status}</span>
                        </div>
                        <p className="text-gray-500 text-xs line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">"{item.message}"</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-[10px] text-gray-500 font-medium">{item.date?.toDate().toLocaleDateString()}</div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleOpenModal('aspirations', item)}
                              className="p-2.5 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-xl"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete("aspirations", item.id)} className="p-2.5 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-xl">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {aspirations.length === 0 && (
                    <div className="px-8 py-12 text-center text-gray-400 text-sm">Belum ada aspirasi.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Manajemen Anggota</h2>
                    <p className="text-gray-500 text-sm">Kelola daftar anggota dan struktur AKD.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative">
                      <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={filterDivision}
                        onChange={(e) => setFilterDivision(e.target.value)}
                        className="pl-10 pr-8 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all shadow-sm font-bold text-sm appearance-none min-w-[160px]"
                      >
                        <option value="Semua">Semua Divisi</option>
                        <option value="BPH">BPH</option>
                        <option value="Komisi">Komisi</option>
                        <option value="Humas">Humas</option>
                        <option value="Legislasi">Legislasi</option>
                        <option value="PSDM">PSDM</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => handleOpenModal('members')}
                      className="px-8 py-3.5 bg-maroon-600 text-white font-bold rounded-2xl hover:bg-maroon-700 transition-all shadow-lg shadow-maroon-600/20 flex items-center justify-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Tambah Anggota</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Jabatan</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">AKD</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Periode</th>
                          <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {members
                          .filter(m => filterDivision === "Semua" || m.akd === filterDivision)
                          .map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                  <img src={getDirectDriveUrl(item.photoUrl)} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">{item.role}</td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">{item.akd}</span>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">{item.period}</td>
                            <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button 
                                  onClick={() => handleOpenModal('members', item)}
                                  className="p-2 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete("members", item.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-50">
                    {members
                      .filter(m => filterDivision === "Semua" || m.akd === filterDivision)
                      .map((item) => (
                      <div key={item.id} className="p-6 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                            <img src={getDirectDriveUrl(item.photoUrl)} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                            <p className="text-maroon-600 text-[10px] font-bold">{item.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold rounded-full uppercase tracking-wider">{item.akd}</span>
                            <span className="text-[10px] text-gray-400 font-bold">{item.period}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleOpenModal('members', item)}
                              className="p-2.5 text-gray-400 hover:text-maroon-600 transition-colors bg-gray-50 rounded-xl"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete("members", item.id)} className="p-2.5 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-xl">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {members.length === 0 && (
                    <div className="px-8 py-12 text-center text-gray-400 text-sm">Belum ada anggota.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Gallery Tab */}
            {activeTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Manajemen Galeri</h2>
                    <p className="text-gray-500 text-sm">Kelola dokumentasi foto dan video kegiatan.</p>
                  </div>
                  <button 
                    onClick={() => handleOpenModal('gallery')}
                    className="px-8 py-3.5 bg-maroon-600 text-white font-bold rounded-2xl hover:bg-maroon-700 transition-all shadow-lg shadow-maroon-600/20 flex items-center justify-center space-x-2"
                  >
                    <Plus size={20} />
                    <span>Tambah Media</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={getDirectDriveUrl(item.type === 'video' ? item.thumbnailUrl : item.url)} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button 
                            onClick={() => handleOpenModal('gallery', item)}
                            className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-xl hover:text-maroon-600 transition-colors shadow-sm"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete("gallery", item.id)} className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 rounded-xl hover:text-red-600 transition-colors shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {item.type}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{item.title}</h4>
                        <p className="text-gray-500 text-xs">{item.date?.toDate().toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 text-sm">Belum ada media di galeri.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab !== "dashboard" && activeTab !== "news" && activeTab !== "aspirations" && activeTab !== "members" && activeTab !== "gallery" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                  <Settings size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Halaman Sedang Dikembangkan</h3>
                <p className="text-gray-500">Fitur manajemen {activeTab} akan segera tersedia.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">
                    {editingItem ? "Edit" : "Tambah"} {modalType === 'news' ? 'Berita' : modalType === 'members' ? 'Anggota' : modalType === 'gallery' ? 'Media' : 'Aspirasi'}
                  </h3>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1">Silakan isi formulir di bawah ini</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6">
                {modalType === 'news' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Judul Berita</label>
                      <input
                        required
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="Masukkan judul berita..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Kategori</label>
                        <select
                          required
                          value={formData.category || ""}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="Kegiatan">Kegiatan</option>
                          <option value="Prestasi">Prestasi</option>
                          <option value="Informasi">Informasi</option>
                          <option value="Opini">Opini</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tanggal</label>
                        <input
                          required
                          type="date"
                          value={formData.date || ""}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">URL Gambar</label>
                      <input
                        required
                        type="url"
                        value={formData.imageUrl || ""}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Konten Berita</label>
                      <textarea
                        required
                        rows={6}
                        value={formData.content || ""}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all resize-none"
                        placeholder="Tulis isi berita di sini..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'members' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                      <input
                        required
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="Nama lengkap anggota..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Jabatan</label>
                        <input
                          required
                          type="text"
                          value={formData.role || ""}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                          placeholder="Contoh: Ketua Umum"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">AKD</label>
                        <select
                          required
                          value={formData.akd || ""}
                          onChange={(e) => setFormData({ ...formData, akd: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        >
                          <option value="">Pilih AKD</option>
                          <option value="Pengurus Harian">Pengurus Harian</option>
                          <option value="Komisi">Komisi</option>
                          <option value="Humas">Humas</option>
                          <option value="Legislasi">Legislasi</option>
                          <option value="PSDM">PSDM</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Periode</label>
                        <input
                          required
                          type="text"
                          value={formData.period || "2025"}
                          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                          placeholder="Contoh: 2025"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Urutan (Order)</label>
                        <input
                          required
                          type="number"
                          value={formData.order || ""}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">URL Foto</label>
                      <input
                        required
                        type="url"
                        value={formData.photoUrl || ""}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">NIM</label>
                        <input
                          type="text"
                          value={formData.nim || ""}
                          onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                          placeholder="Masukkan NIM..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Angkatan</label>
                        <input
                          type="text"
                          value={formData.batch || ""}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                          placeholder="Contoh: 2022"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Instagram</label>
                      <input
                        type="text"
                        value={formData.instagram || ""}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="@username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Bio / Motto</label>
                      <textarea
                        rows={3}
                        value={formData.bio || ""}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all resize-none"
                        placeholder="Tulis bio singkat..."
                      />
                    </div>
                  </>
                )}

                {modalType === 'gallery' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Judul Media</label>
                      <input
                        required
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="Judul kegiatan..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tipe Media</label>
                        <select
                          required
                          value={formData.type || "photo"}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        >
                          <option value="photo">Gambar</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Tanggal</label>
                        <input
                          required
                          type="date"
                          value={formData.date || ""}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">URL Media</label>
                      <input
                        required
                        type="url"
                        value={formData.url || ""}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                        placeholder="URL gambar atau video..."
                      />
                    </div>
                    {formData.type === 'video' && (
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-wider">URL Thumbnail (Video)</label>
                        <input
                          required
                          type="url"
                          value={formData.thumbnailUrl || ""}
                          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                          placeholder="URL thumbnail video..."
                        />
                      </div>
                    )}
                  </>
                )}

                {modalType === 'aspirations' && (
                  <>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Pesan Aspirasi</div>
                      <p className="text-gray-900 text-sm leading-relaxed">{formData.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Status Tanggapan</label>
                      <select
                        required
                        value={formData.status || "pending"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Ditinjau</option>
                        <option value="responded">Ditanggapi</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-6 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-8 py-4 bg-maroon-600 text-white font-bold rounded-2xl hover:bg-maroon-700 transition-all shadow-lg shadow-maroon-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={20} />
                    )}
                    <span>{editingItem ? "Simpan Perubahan" : "Tambah Data"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from "motion/react";
import { ShieldCheck, Target, Award, Sparkles } from "lucide-react";

const vision = "Membangun lembaga yang aspiratif bagi mahasiswa dengan mengedepankan kolektif suara dalam pengambilan keputusan yang transparan, adaptif dan fleksibel untuk mahasiswa dalam meningkatkan kolaborasi agar mampu menjadi tempat untuk tumbuh, berkembang, belajar, dan berdinamika bagi seluruh mahasiswa Pendidikan Kepelatihan Olahraga FPOK UPI";

const missions = [
  "Mengembangkan budaya organisasi yang transparan, adaptif, dan fleksibel.",
  "Mendorong kolaborasi yang sinergis dan profesional.",
  "Optimalisasi peran DPM HIMA PKO sebagai lembaga yang aspiratif menyuarakan, menyalurkan dan mengadvokasi ide, aspirasi, dan inovasi mahasiwa.",
  "Menciptakan jaringan komunikasi dan organisasi yang baik dikalangan mahasiswa pendidikan kepelatihan olahraga."
];

const logoMeaning = [
  {
    title: "Lingkaran",
    desc: "Lingkaran yang tak bulat sempurna menjaga nyala warna, melambangkan kondisi yang tidak selalu sempurna tapi bisa menjaga isinya.",
    img: "https://drive.google.com/file/d/1Ck8e-Fm2sEspIEMJTF-Uf1JwkhfzI8Af/view?usp=drive_link"
  },
  {
    title: "Perisai R",
    desc: "Shield and sign “R” melambangkan makna ressilience yang tangguh, adaptif dan teguh",
    img: "https://drive.google.com/file/d/1-gKB3OMi46iwzey5BSIvol_DBpUpjJq6/view?usp=drive_link"
  },
  {
    title: "Api",
    desc: "Api menyala melambangkan semangat perjuangan, keberanian, dan daya tahan.",
    img: "https://drive.google.com/file/d/1LLuLJraNq5f93jNbsXdA3lWoaJVDPqrQ/view?usp=drive_link"
  }
];

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

export default function Profile() {
  return (
    <div className="pt-24 pb-20 bg-gray-50">
      {/* Header */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-maroon-600 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-maroon-600 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 sm:mb-10"
          >
            <img 
              src={getDirectDriveUrl("https://drive.google.com/file/d/1zrA4l4_KDja1efdj-f0tQKUV1CN11a8Z/view?usp=drive_link")} 
              alt="DPM Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight leading-tight"
          >
            Profil DPM HIMA PKO
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center space-x-3 sm:space-x-4 mb-10 group"
          >
            <div className="h-[1px] w-6 sm:w-10 bg-maroon-600 transition-all duration-700 group-hover:w-16" />
            <span className="text-[10px] sm:text-sm font-black text-maroon-600 uppercase tracking-[0.25em] sm:tracking-[0.4em]">
              Parlemen Resilience 2025/2026
            </span>
            <div className="h-[1px] w-6 sm:w-10 bg-maroon-600 transition-all duration-700 group-hover:w-16" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed px-2"
          >
            Mengenal lebih dalam jati diri, visi, dan perjuangan DPM HIMA PKO dalam mewujudkan aspirasi mahasiswa.
          </motion.p>
        </div>
      </section>

      {/* Makna Logo Section */}
      <section className="py-20 sm:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative group">
                <div className="relative bg-white p-8 sm:p-16 rounded-[48px] sm:rounded-[64px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 transition-all duration-1000 group-hover:shadow-[0_48px_96px_-24px_rgba(159,18,57,0.1)] group-hover:-translate-y-4">
                  <img 
                    src={getDirectDriveUrl("https://drive.google.com/file/d/1B5oH2pYlG9qk-s2sUbzp_toPRAhlT8zg/view?usp=drive_link")} 
                    alt="Logo Parlemen Ressilience" 
                    className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle inner accent */}
                  <div className="absolute inset-8 border border-gray-50 rounded-[32px] sm:rounded-[48px] pointer-events-none" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-2xl sm:text-5xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">Makna Parlemen Resilience</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 font-medium leading-relaxed">
                Setiap elemen dalam logo kami merepresentasikan nilai-nilai perjuangan, adaptabilitas, dan semangat yang kami bawa dalam menjalankan amanah.
              </p>

              <div className="space-y-6 sm:space-y-8">
                {logoMeaning.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 sm:space-x-6 group"
                  >
                    <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-lg border border-gray-100 transition-transform group-hover:scale-110">
                      <img 
                        src={getDirectDriveUrl(item.img)} 
                        alt={item.title} 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-base leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 sm:py-32 bg-gray-50 overflow-hidden text-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 sm:mb-32"
          >
            <div className="flex items-center justify-center mb-10">
              <h2 className="text-4xl sm:text-6xl font-black tracking-[0.2em] text-gray-900">
                VISI
              </h2>
            </div>
            
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 leading-[1.8] max-w-4xl mx-auto italic text-justify">
              "{vision}"
            </p>
          </motion.div>

          {/* Mission */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-12">
                <h2 className="text-4xl sm:text-6xl font-black tracking-[0.2em] text-gray-900">
                  MISI
                </h2>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              {missions.map((mission, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-start space-x-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group text-left"
                >
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-maroon-50 text-maroon-600 flex items-center justify-center text-lg font-black group-hover:bg-maroon-600 group-hover:text-white transition-colors duration-500">
                    {index + 1}
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium pt-2 text-justify sm:text-left">
                    {mission}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AKD Section */}
      <section className="py-20 sm:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-20"
          >
            <div className="inline-flex items-center space-x-2 text-maroon-600 font-black mb-4 sm:mb-6">
              <ShieldCheck size={20} className="sm:w-6 sm:h-6" />
              <span className="uppercase tracking-[0.2em] text-xs sm:text-sm">Struktur Kerja</span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">Alat Kelengkapan Dewan</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium px-4">
              Struktur internal DPM HIMA PKO yang menjalankan fungsi-fungsi spesifik organisasi secara profesional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {[
              { name: "BPH", desc: "Badan Pengurus Harian (BPH) merupakan inti dari kepengurusan DPM HIMA PKO yang bertanggung jawab penuh dalam mengoordinasikan, mengarahkan, dan mengontrol jalannya roda organisasi secara keseluruhan.", icon: ShieldCheck },
              { name: "Komisi", desc: "Komisi memiliki peran vital dalam menjalankan fungsi pengawasan terhadap kinerja eksekutif, serta bertanggung jawab dalam proses legislasi dan penganggaran.", icon: Target },
              { name: "Humas", desc: "Divisi Hubungan Masyarakat (Humas) bertugas sebagai garda terdepan dalam membangun relasi positif, mengelola informasi publik, dan jembatan komunikasi.", icon: Award },
              { name: "Legislasi", desc: "Divisi Legislasi berfokus pada penyusunan hukum dan produk peraturan organisasi, memastikan setiap landasan operasional DPM sesuai dengan aturan.", icon: ShieldCheck },
              { name: "PSDM", desc: "Pengembangan Sumber Daya Mahasiswa (PSDM) berfokus pada upaya peningkatan kompetensi, karakter, dan produktivitas anggota.", icon: Target }
            ].map((akd, index) => (
              <motion.div
                key={akd.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-maroon-900/5 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 sm:w-20 h-20 bg-white text-maroon-600 rounded-2xl sm:rounded-[28px] flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-maroon-600 group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                  <akd.icon size={28} className="sm:w-9 sm:h-9" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">{akd.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-bold">
                  {akd.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

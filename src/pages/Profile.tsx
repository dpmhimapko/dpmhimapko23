import { motion } from "motion/react";
import { ShieldCheck, Target, History, Award, CheckCircle2 } from "lucide-react";

const vision = "Mewujudkan DPM HIMA PKO sebagai lembaga legislatif mahasiswa yang aspiratif, transparan, dan berintegritas demi kemajuan Pendidikan Kepelatihan Olahraga.";

const missions = [
  "Menjalankan fungsi legislasi, pengawasan, dan anggaran secara optimal dan bertanggung jawab.",
  "Membangun sistem komunikasi yang efektif dan terbuka bagi seluruh mahasiswa PKO.",
  "Menampung dan memperjuangkan aspirasi mahasiswa PKO secara proaktif.",
  "Meningkatkan sinergitas antara DPM, HIMA, dan seluruh elemen mahasiswa PKO.",
  "Menjaga integritas dan profesionalisme pengurus dalam setiap aspek organisasi."
];

const history = `Pendidikan Kepelatihan Olahraga (PKO) merupakan salah satu program studi yang memiliki sejarah panjang dalam mencetak pelatih dan tenaga ahli olahraga profesional. Seiring dengan perkembangan dinamika kemahasiswaan, Dewan Perwakilan Mahasiswa (DPM) HIMA PKO dibentuk sebagai lembaga tertinggi dalam struktur organisasi mahasiswa di tingkat program studi.

DPM HIMA PKO lahir dari kebutuhan akan adanya check and balance terhadap kinerja eksekutif (HIMA PKO). Sejak awal berdirinya, DPM telah menjadi garda terdepan dalam mengawal aspirasi mahasiswa dan memastikan setiap kebijakan yang diambil oleh Himpunan berpihak pada kepentingan mahasiswa PKO.

Hingga saat ini, DPM HIMA PKO terus bertransformasi menjadi organisasi yang lebih modern, memanfaatkan teknologi informasi untuk menjangkau konstituennya, dan tetap memegang teguh nilai-nilai sportivitas serta integritas yang menjadi ciri khas insan olahraga.`;

export default function Profile() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="relative py-20 bg-white border-b border-gray-100 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-maroon-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-maroon-600/20"
          >
            <ShieldCheck size={40} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 px-4"
          >
            Profil DPM HIMA PKO UPI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium px-4"
          >
            Mengenal lebih dalam jati diri, visi, dan perjuangan DPM HIMA PKO.
          </motion.p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-maroon-600 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-maroon-600/20"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 sm:mb-8">
                  <Target size={32} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Visi Kami</h2>
                <p className="text-lg sm:text-xl leading-relaxed font-medium italic">
                  "{vision}"
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-6">
                <Award size={20} />
                <span className="uppercase tracking-wider text-sm">Misi Kami</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Langkah Strategis Organisasi</h2>
              <div className="space-y-4 sm:space-y-6">
                {missions.map((mission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="text-maroon-600" size={20} />
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                      {mission}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-maroon-100 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-maroon-200 rounded-full blur-3xl opacity-60" />
              <div className="relative z-10 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop" 
                  alt="Organization History" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 sm:p-10">
                  <div className="text-white">
                    <div className="text-3xl sm:text-4xl font-bold mb-1">10+</div>
                    <div className="text-xs sm:text-sm font-medium text-white/80">Tahun Berdedikasi</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-6">
                <History size={20} />
                <span className="uppercase tracking-wider text-sm">Sejarah Singkat</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Perjalanan DPM HIMA PKO</h2>
              <div className="prose prose-sm sm:prose-lg text-gray-600 max-w-none">
                {history.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 sm:mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AKD Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alat Kelengkapan Dewan (AKD)</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Struktur internal DPM HIMA PKO yang menjalankan fungsi-fungsi spesifik organisasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Komisi I", desc: "Membidangi urusan Legislasi dan Hukum Organisasi.", icon: ShieldCheck },
              { name: "Komisi II", desc: "Membidangi urusan Pengawasan Kinerja Himpunan.", icon: Target },
              { name: "Badan Kehormatan", desc: "Menjaga integritas, etika, dan disiplin pengurus.", icon: Award }
            ].map((akd, index) => (
              <motion.div
                key={akd.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group text-center"
              >
                <div className="w-16 h-16 bg-maroon-100 text-maroon-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-maroon-600 group-hover:text-white transition-colors">
                  <akd.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{akd.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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

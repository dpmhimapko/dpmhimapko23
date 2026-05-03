import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, ShieldCheck, HelpCircle, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/src/lib/utils";
import { toast } from "react-hot-toast";
import { db, collection, addDoc, OperationType, handleFirestoreError } from "../firebase";

const aspirationSchema = z.object({
  isAnonymous: z.boolean(),
  name: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  category: z.enum(["Akademik", "Fasilitas", "Organisasi", "Lainnya"]),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
}).refine((data) => {
  if (!data.isAnonymous && (!data.name || data.name.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Nama wajib diisi jika tidak anonim",
  path: ["name"],
});

type AspirationFormValues = z.infer<typeof aspirationSchema>;

export default function Aspirations() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<AspirationFormValues>({
    resolver: zodResolver(aspirationSchema),
    defaultValues: {
      isAnonymous: false,
      category: "Akademik",
      name: "",
      email: "",
      message: "",
    }
  });

  const selectedCategory = watch("category");
  const isAnonymous = watch("isAnonymous");

  const onSubmit = async (data: AspirationFormValues) => {
    setIsLoading(true);
    try {
      const finalData = {
        name: data.isAnonymous ? "Anonim" : (data.name || "Anonim"),
        email: data.email || "",
        category: data.category,
        message: data.message,
        isAnonymous: data.isAnonymous,
        date: new Date(),
        status: "pending"
      };
      await addDoc(collection(db, "aspirations"), finalData);
      setIsSubmitted(true);
      toast.success("Aspirasi berhasil dikirim!");
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Gagal mengirim aspirasi. Silakan coba lagi.");
      handleFirestoreError(error, OperationType.CREATE, "aspirations");
    } finally {
      setIsLoading(false);
    }
  };

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
                <MessageSquare size={20} />
                <span className="uppercase tracking-wider text-sm">Layanan Suara Mahasiswa</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Kotak Aspirasi UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Suara Anda adalah prioritas kami. Sampaikan aspirasi, kritik, atau saran Anda untuk kemajuan PKO Universitas Pendidikan Indonesia yang lebih baik.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Column */}
            <div className="lg:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <HelpCircle size={20} className="text-maroon-600" />
                  <span>Alur Aspirasi</span>
                </h3>
                <div className="space-y-6">
                  {[
                    { step: "01", title: "Submit Pesan", desc: "Isi formulir aspirasi dengan data yang benar." },
                    { step: "02", title: "Verifikasi", desc: "DPM akan memverifikasi dan mengkategorikan pesan." },
                    { step: "03", title: "Tindak Lanjut", desc: "Aspirasi akan dibahas dalam rapat komisi terkait." },
                    { step: "04", title: "Respon", desc: "Hasil tindak lanjut akan dipublikasikan atau dikirim ke email." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="flex items-start space-x-4"
                    >
                      <div className="text-maroon-600 font-black text-lg leading-none pt-1">{item.step}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Form Column */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm relative">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="flex items-center space-x-3 mb-10">
                        <div className="w-12 h-12 bg-maroon-100 rounded-2xl flex items-center justify-center text-maroon-600">
                          <Send size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Kirim Aspirasi Baru</h2>
                          <p className="text-gray-500 text-sm">Lengkapi formulir di bawah ini.</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <label className="flex items-center space-x-3 cursor-pointer group mb-2">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isAnonymous}
                                onChange={(e) => {
                                  setValue("isAnonymous", e.target.checked);
                                  if (e.target.checked) setValue("name", "");
                                }}
                              />
                              <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon-600"></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 select-none">Kirim sebagai Anonim</span>
                          </label>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence mode="wait">
                              {!isAnonymous && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-2 overflow-hidden"
                                >
                                  <label className="text-sm font-bold text-gray-700 ml-1">Nama Lengkap</label>
                                  <input
                                    {...register("name")}
                                    placeholder="Masukkan nama Anda"
                                    className={cn(
                                      "w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all",
                                      errors.name ? "border-red-300 bg-red-50" : "border-gray-100"
                                    )}
                                  />
                                  {errors.name && (
                                    <p className="text-red-500 text-xs font-bold flex items-center mt-1 ml-1">
                                      <AlertCircle size={12} className="mr-1" />
                                      {errors.name.message}
                                    </p>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-gray-700 ml-1">Email (Opsional)</label>
                              <input
                                {...register("email")}
                                placeholder="email@contoh.com"
                                className={cn(
                                  "w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all",
                                  errors.email ? "border-red-300 bg-red-50" : "border-gray-100"
                                )}
                              />
                              {errors.email && (
                                <p className="text-red-500 text-xs font-bold flex items-center mt-1 ml-1">
                                  <AlertCircle size={12} className="mr-1" />
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Kategori Aspirasi</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {["Akademik", "Fasilitas", "Organisasi", "Lainnya"].map((cat) => (
                              <label
                                key={cat}
                                className={cn(
                                  "flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm",
                                  selectedCategory === cat
                                    ? "border-maroon-600 bg-maroon-50 text-maroon-600"
                                    : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                                )}
                              >
                                <input
                                  type="radio"
                                  value={cat}
                                  {...register("category")}
                                  className="hidden"
                                />
                                {cat}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 ml-1">Pesan Aspirasi</label>
                          <textarea
                            {...register("message")}
                            rows={6}
                            placeholder="Tuliskan aspirasi, kritik, atau saran Anda secara detail di sini..."
                            className={cn(
                              "w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all resize-none",
                              errors.message ? "border-red-300 bg-red-50" : "border-gray-100"
                            )}
                          />
                          <div className="flex justify-between items-center mt-1 px-1">
                            {errors.message ? (
                              <p className="text-red-500 text-xs font-bold flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                {errors.message.message}
                              </p>
                            ) : (
                              <p className="text-gray-400 text-xs flex items-center">
                                <Info size={12} className="mr-1" />
                                Minimal 10 karakter
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "w-full py-5 bg-maroon-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-maroon-600/20 flex items-center justify-center space-x-3",
                            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-maroon-700 active:scale-[0.98]"
                          )}
                        >
                          {isLoading ? (
                            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>Kirim Aspirasi</span>
                              <Send size={20} />
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-600/10">
                        <CheckCircle2 size={48} />
                      </div>
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Aspirasi Terkirim!</h2>
                      <p className="text-gray-600 max-w-md mx-auto mb-10 leading-relaxed">
                        Terima kasih telah menyampaikan aspirasi Anda. Pesan Anda telah kami terima dan akan segera kami tindak lanjuti.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl"
                      >
                        Kirim Aspirasi Lain
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, ShieldCheck, HelpCircle, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/src/lib/utils";
import { db, collection, addDoc, OperationType, handleFirestoreError } from "../firebase";

const aspirationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  category: z.enum(["Akademik", "Fasilitas", "Organisasi", "Lainnya"]),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
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
  } = useForm<AspirationFormValues>({
    resolver: zodResolver(aspirationSchema),
    defaultValues: {
      category: "Akademik",
    }
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data: AspirationFormValues) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "aspirations"), {
        ...data,
        date: new Date(),
        status: "pending"
      });
      setIsSubmitted(true);
      reset();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "aspirations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 text-maroon-600 font-bold mb-4">
                <MessageSquare size={20} />
                <span className="uppercase tracking-wider text-sm">Layanan Suara Mahasiswa</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Kotak Aspirasi UPI</h1>
              <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
                Suara Anda adalah prioritas kami. Sampaikan aspirasi, kritik, atau saran Anda untuk kemajuan PKO Universitas Pendidikan Indonesia yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info Column */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-maroon-600 rounded-[32px] p-8 text-white shadow-2xl shadow-maroon-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <ShieldCheck size={32} className="mb-6 text-maroon-200" />
                  <h3 className="text-xl font-bold mb-4">Privasi Terjamin</h3>
                  <p className="text-maroon-100 text-sm leading-relaxed mb-6">
                    Anda dapat menyampaikan aspirasi secara anonim. Identitas Anda hanya akan digunakan untuk keperluan tindak lanjut jika Anda mencantumkannya.
                  </p>
                  <div className="flex items-center space-x-2 text-xs font-bold text-maroon-200">
                    <CheckCircle2 size={14} />
                    <span>Enkripsi Data Aman</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
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
                    <div key={i} className="flex items-start space-x-4">
                      <div className="text-maroon-600 font-black text-lg leading-none pt-1">{item.step}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Nama (Opsional)</label>
                            <input
                              {...register("name")}
                              placeholder="Masukkan nama Anda"
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-maroon-600 outline-none transition-all"
                            />
                          </div>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

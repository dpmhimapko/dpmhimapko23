import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, FirebaseUser, doc, getDoc, setDoc, OperationType, handleFirestoreError, collection, query, where, getDocs, addDoc, writeBatch } from './firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAuthReady: false,
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const isMasterAdmin = firebaseUser.email === 'aahdan298@gmail.com' && firebaseUser.emailVerified;
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // If it's the master admin but the role in DB is not admin, update it or just set it in state
            if (isMasterAdmin && userData.role !== 'admin') {
              setRole('admin');
              // Optionally update the DB
              await setDoc(doc(db, 'users', firebaseUser.uid), { ...userData, role: 'admin' }, { merge: true });
            } else {
              setRole(userData.role as 'admin' | 'user');
            }
          } else {
            // Create default user profile if not exists
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || '',
              role: isMasterAdmin ? 'admin' : 'user',
              createdAt: new Date(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setRole(newUser.role as 'admin' | 'user');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          if (firebaseUser.email === 'aahdan298@gmail.com' && firebaseUser.emailVerified) {
            setRole('admin');
          }
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
      setIsAuthReady(true);

      // Seeding Logic - Runs once when auth is ready
      const seedData = async () => {
        try {
          const newsTitle = "Pelantikan Pengurus Baru DPM & BEM HIMA PKO 2025 - 2026";
          const newsQuery = query(collection(db, "news"), where("title", "==", newsTitle));
          const newsSnap = await getDocs(newsQuery);

          const getDirectDriveUrl = (url: string) => {
            if (!url) return "";
            const fileId = url.includes("/file/d/") 
              ? url.split("/file/d/")[1].split("/")[0] 
              : url.includes("id=") ? url.split("id=")[1].split("&")[0] : "";
            return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` : url;
          };

          const imageUrls = [
            "https://drive.google.com/file/d/1tABpxKxZa-g8HFDiBdaSYWJ4J9T-ueYc/view?usp=drive_link",
            "https://drive.google.com/file/d/1aZmL98oQhPiVueliMSuRSCm3PCcKo2hs/view?usp=drive_link",
            "https://drive.google.com/file/d/1VQFPV1I_0qYpwvNZpxZ_syN7xpis3Rte/view?usp=drive_link",
            "https://drive.google.com/file/d/11oIWx5kFpl64ePw7p9bELTys6npxZ3kw/view?usp=drive_link"
          ].map(getDirectDriveUrl);

          if (newsSnap.empty) {
            const newsContent = `Pelantikan Pengurus Baru DPM & BEM HIMA PKO 2025 - 2026
telah sukses dilaksanakan pada 23 Desember 2025 ✨
Menjadi puncak dari rangkaian regenerasi organisasi, momen ini menandai lahirnya kepemimpinan yang tangguh, kolaboratif, dan berorientasi pada kemajuan mahasiswa yang berdampak.

Lebih dari sekadar peresmian, pelantikan ini adalah awal komitmen para pengurus terpilih untuk menjalankan amanah secara profesional, bertanggung jawab, dan berintegritas, demi penguatan peran mahasiswa dan kebermanfaatan nyata di lingkungan akademik.
Dengan semangat sinergi dan kolaborasi, DPM & BEM HIMA PKO siap melangkah sebagai motor penggerak organisasi yang adaptif, progresif, dan membawa perubahan positif 🚀

#PelantikanHIMAPKO
#DPMBEMPKO
#RegenerasiOrganisasi
#KepemimpinanMahasiswa
#MahasiswaBerdampak
KolaborasiDanSinergi
OrganisasiMahasiswa
HIMAPKO`;

            await addDoc(collection(db, "news"), {
              title: newsTitle,
              content: newsContent,
              date: new Date(2025, 11, 23),
              category: "Pengumuman",
              imageUrl: imageUrls[0],
              author: "Admin",
              authorUid: "system"
            });
          }

          // Check Gallery independently
          const galleryQuery = query(collection(db, "gallery"), where("title", "==", "Dokumentasi Pelantikan 2025 - Part 1"));
          const gallerySnap = await getDocs(galleryQuery);

          if (gallerySnap.empty) {
            const batch = writeBatch(db);
            imageUrls.forEach((url, index) => {
              const galleryRef = doc(collection(db, "gallery"));
              batch.set(galleryRef, {
                title: `Dokumentasi Pelantikan 2025 - Part ${index + 1}`,
                url: url,
                type: "photo",
                date: new Date(2025, 11, 23),
                category: "Kegiatan"
              });
            });
            await batch.commit();
          }
        } catch (error) {
          console.error("Seeding error:", error);
        }
      };

      seedData();
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

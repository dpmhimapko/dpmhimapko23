import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, FirebaseUser, doc, getDoc, setDoc, OperationType, handleFirestoreError } from './firebase';

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
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
};

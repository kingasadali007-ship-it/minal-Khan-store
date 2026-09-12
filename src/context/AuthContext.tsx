import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateCustomerProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  enterAdminModeWithKey: (key: string) => boolean;
  setAdminSessionKey: (key: string) => boolean;
  exitAdminKeyMode: () => void;
  adminKeyActive: boolean;
  adminSessionKey: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'kingasadali007@gmail.com';
const ADMIN_MASTER_PASSCODE = 'minalkhan786';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminKeyActive, setAdminKeyActive] = useState<boolean>(() => {
    return localStorage.getItem('minal_admin_key_session') === 'true';
  });

  const fetchUserProfile = async (firebaseUser: User) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Customer',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          role: firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
          wishlist: [],
        };
        await setDoc(userDocRef, newProfile, { merge: true });
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    if (res.user) {
      await fetchUserProfile(res.user);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await fetchUserProfile(res.user);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const newProfile: UserProfile = {
        id: res.user.uid,
        name,
        email,
        role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        wishlist: [],
      };
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setAdminKeyActive(false);
    localStorage.removeItem('minal_admin_key_session');
    setUserProfile(null);
  };

  const updateCustomerProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, data, { merge: true });
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const enterAdminModeWithKey = (key: string): boolean => {
    if (key.trim() === ADMIN_MASTER_PASSCODE) {
      setAdminKeyActive(true);
      localStorage.setItem('minal_admin_key_session', 'true');
      return true;
    }
    return false;
  };

  const exitAdminKeyMode = () => {
    setAdminKeyActive(false);
    localStorage.removeItem('minal_admin_key_session');
  };

  const isAdmin =
    adminKeyActive ||
    (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    userProfile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        loginWithEmail,
        signInWithEmail: loginWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        signOutUser: logout,
        updateCustomerProfile,
        updateProfileData: updateCustomerProfile,
        enterAdminModeWithKey,
        setAdminSessionKey: enterAdminModeWithKey,
        exitAdminKeyMode,
        adminKeyActive,
        adminSessionKey: adminKeyActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

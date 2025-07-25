'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, provider } from '@/lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem('firebaseUser', JSON.stringify(firebaseUser));

        // Save to DB
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          }),
        });
      } else {
        setUser(null);
        localStorage.removeItem('firebaseUser');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged handles setting user
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('firebaseUser');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">You're not logged in</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[#fffdf8] text-gray-800">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-3xl p-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md mb-4"
          />
          <h2 className="text-xl font-semibold">{user.displayName}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="border-t pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">UID</span>
            <span className="text-gray-500 max-w-[150px] truncate text-right">
              {user.uid}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Auth Provider</span>
            <span className="text-gray-500 text-right">Google</span>
          </div>

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium hover:opacity-90 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

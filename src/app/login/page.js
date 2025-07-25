'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function LoginPage() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Save to DB only on new login
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          }),
        });

        router.replace('/'); // redirect only after login
      } else {
        setUser(null);
      }

      setInitializing(false); // auth check is done
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // No redirect needed here — the effect above handles it
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <p className="text-lg text-gray-500">Checking auth status...</p>
      </main>
    );
  }

  // If already logged in, prevent showing login button again
  if (user) {
    return null; // Or show a loading spinner
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Login to Umego 🚀</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? 'Signing in…' : 'Sign In with Google'}
      </button>
    </main>
  );
}

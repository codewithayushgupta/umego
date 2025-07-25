'use client';
import { useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Save to DB
        await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          })
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to umigo 👋</h1>
      {user ? (
        <>
          <img src={user.photoURL} className="rounded-full w-16 h-16 mb-2" />
          <p>Hello, {user.displayName}</p>
          <button onClick={handleLogout} className="mt-4 bg-red-500 px-4 py-2 rounded text-white">
            Sign Out
          </button>
        </>
      ) : (
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded">
          Sign In with Google
        </button>
      )}
    </main>
  );
}

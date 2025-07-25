'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GlowListPage() {
  const [hangouts, setHangouts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem('firebaseUser'));
      if (!user) return;

      const res = await fetch(`/api/hangout/user/${user.uid}`);
      const data = await res.json();
      if (data.success) setHangouts(data.hangouts);
    };
    load();
  }, []);

  if (!hangouts.length) {
    return (
      <div className="p-6 text-center text-gray-500">No hangouts found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">🧡 Your Glow Hangouts</h2>
      <div className="grid gap-4">
        {hangouts.map((h) => (
          <div
            key={h._id}
            onClick={() => router.push(`/glow/${h._id}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{h.eventName}</h3>
            <p className="text-sm text-gray-500">
              {h.location} • {new Date(h.dateTime).toLocaleString()}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {h.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

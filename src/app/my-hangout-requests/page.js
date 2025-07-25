'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyHangoutRequests() {
  const [hangouts, setHangouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('firebaseUser'));

    if (!user) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    async function fetchMyHangouts() {
      try {
        const res = await fetch(`/api/hangout/user/${user.uid}`);
        const data = await res.json();
        if (data.success) {
          const myCreatedHangouts = data.hangouts.filter(
            (h) => h.createdBy.uid === user.uid
          );
          setHangouts(myCreatedHangouts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyHangouts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">My Created Hangouts</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : !isLoggedIn ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">You’re not logged in.</p>
          <button
            onClick={() => router.push('/create-hangout')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create a Hangout
          </button>
        </div>
      ) : hangouts.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">You haven’t created any hangouts yet.</p>
          <Link
            href="/create-hangout"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create a Hangout
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {hangouts.map((h) => (
            <Link
              href={`/my-hangout-requests/${h._id}`}
              key={h._id}
              className="block border rounded-lg p-4 shadow hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold">{h.eventName}</h3>
              <p className="text-sm text-gray-600">{h.location}</p>
              <p className="text-sm">📅 {new Date(h.dateTime).toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">🧍 Max: {h.maxPeople}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {h.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

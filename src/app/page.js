"use client";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const [hangouts, setHangouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHangouts() {
      try {
        const res = await fetch("/api/hangout/list");
        const data = await res.json();
        if (data.success) setHangouts(data.hangouts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHangouts();
  }, []);

const sendRequest = async (hangoutId) => {
  const user = JSON.parse(localStorage.getItem("firebaseUser"));
  if (!user) {
    alert("Please login to request");
    window.location.href = "/profile"; // redirect to profile page
    return;
  }

  const res = await fetch("/api/request/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hangoutId, user }),
  });

  const data = await res.json();
  if (data.success) {
    alert("Request sent ✅");
  } else {
    alert("❌ " + data.message);
  }
};


  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">
        What's Happening Near You?
      </h2>

      {loading ? (
        <div className="flex justify-center mt-10">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-400 border-t-transparent"></div>
        </div>
      ) : hangouts.length === 0 ? (
        <p className="text-center text-gray-500">No hangouts yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {hangouts.map((h) => (
            <div
              key={h._id}
              className="bg-orange-100 rounded-2xl p-4 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-orange-900">
                  {h.eventName}
                </h3>
                <span className="text-xs text-orange-600">
                  {new Date(h.dateTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-orange-800 mb-1">📍 {h.location}</p>
              <p className="text-sm text-orange-700 mb-1">
                🎯 Tags: {h.tags.join(", ")}
              </p>
              <p className="text-sm text-orange-700 mb-1">
                👥 Max: {h.maxPeople}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={h.createdBy.photoURL}
                  alt="creator"
                  className="w-7 h-7 rounded-full border-2 border-white"
                />
                <span className="text-sm text-orange-900 font-medium">
                  {h.createdBy.name}
                </span>
              </div>
              <button
                onClick={() => sendRequest(h._id)}
                className="mt-4 w-full bg-orange-600 text-white py-2 rounded-xl text-sm hover:bg-orange-700 transition"
              >
                Request to Join
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

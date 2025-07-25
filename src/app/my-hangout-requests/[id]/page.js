'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/image";


export default function HangoutRequestsPage() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch(`/api/request/by-hangout/${id}`);
        const data = await res.json();
        if (data.success) setRequests(data.requests);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [id]);

  const handleAction = async (requestId, action) => {
    const res = await fetch('/api/request/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action })
    });

    const data = await res.json();
    if (data.success) {
      alert(`Request ${action}`);
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: action } : r))
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Requests for Hangout #{id}</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="border p-4 rounded-lg">
              <div className="flex items-center gap-3">
<Image
  src={hangout?.createdBy?.photoURL}
  alt={hangout?.createdBy?.name || "User Photo"}
  width={40}
  height={40}
  className="h-10 w-10 rounded-full"
/>                <div>
                  <p className="font-semibold">{r.user.name}</p>
                  <p className="text-sm text-gray-500">{r.user.email}</p>
                </div>
              </div>
              <p className="mt-2">Status: <strong>{r.status}</strong></p>

              {r.status === 'pending' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleAction(r._id, 'approved')}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(r._id, 'rejected')}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

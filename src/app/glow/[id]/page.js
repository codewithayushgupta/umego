'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
              import Image from "next/image";


export default function GlowChat() {
  const { id } = useParams(); // hangoutId
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/chat/messages/${id}`);
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    };
    load();
  }, [id]);

  const send = async () => {
    const user = JSON.parse(localStorage.getItem('firebaseUser'));
    if (!user || !text) return;

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hangoutId: id, sender: user, text })
    });

    const data = await res.json();
    if (data.success) {
      setMessages([...messages, data.message]);
      setText('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">💬 Glow Chat</h2>
      <div className="border rounded-lg h-96 overflow-y-scroll p-4 bg-white shadow-inner">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <div className="flex items-center gap-2">
<Image
  src={m.sender.photoURL}
  alt={"Profile Picture"}
  className="w-6 h-6 rounded-full"
/>

              <p className="font-semibold text-sm">{m.sender.name}</p>
            </div>
            <p className="ml-8 text-sm">{m.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}

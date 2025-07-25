"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";

const availableTags = ["Music", "Food", "Gaming", "Movies", "Cafe", "Dance"];

export default function CreateHangoutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    eventName: "",
    location: "",
    dateTime: "",
    tags: [],
    maxPeople: "",
    expiresIn: "1",
  });

  const handleTagClick = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("firebaseUser"));
  
  if (!user) {
    alert("Please login to start a hangout");
    window.location.href = "/profile"; // redirect to login/profile page
    return;
  }

  const payload = {
    ...form,
    maxPeople: Number(form.maxPeople),
    tags: form.tags,
    dateTime: new Date(form.dateTime),
    expiresAt: new Date(Date.now() + Number(form.expiresIn) * 60 * 60 * 1000),
    createdBy: {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    },
  };

  const res = await fetch("/api/hangout/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.success) {
    alert("🎉 Hangout created!");
    router.push("/explore");
  } else {
    alert("❌ Failed: " + data.message);
  }
};


  return (
    <div className="min-h-screen px-6 py-8 bg-[#fffdf8]">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-3xl p-6 space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">Start a Hang</h2>

        <input
          name="eventName"
          placeholder="What’s the plan?"
          value={form.eventName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm placeholder:text-gray-400"
        />

        <div className="relative">
          <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            name="location"
            placeholder="Choose location"
            value={form.location}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
          <input
            name="dateTime"
            type="datetime-local"
            value={form.dateTime}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        <div className="w-full">
          <input
            name="maxPeople"
            type="number"
            value={form.maxPeople}
            onChange={handleChange}
            placeholder="Max People"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        <div className="w-full">
          <input
            name="expiresIn"
            type="number"
            value={form.expiresIn}
            onChange={handleChange}
            placeholder="Expires In (hrs)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Pick tags</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                  form.tags.includes(tag)
                    ? "bg-orange-400 text-white border-orange-400"
                    : "bg-orange-50 text-orange-700 border-orange-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-medium hover:opacity-90 transition"
        >
          Start Hang
        </button>
      </div>
    </div>
  );
}

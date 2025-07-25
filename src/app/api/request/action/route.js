// app/api/request/action/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import Request from "@/models/Request";
import GroupChat from "@/models/GroupChat";

export async function POST(req) {
  await connectDB();
  const { requestId, action } = await req.json(); // action = 'approved' or 'rejected'

  if (!["approved", "rejected"].includes(action)) {
    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  }

  const updated = await Request.findByIdAndUpdate(
    requestId,
    { status: action },
    { new: true }
  );

  if (action === "approved") {
    // find or create group chat
    let chat = await GroupChat.findOne({ hangoutId: request.hangoutId });
    if (!chat) {
      chat = await GroupChat.create({
        hangoutId: request.hangoutId,
        users: [request.user],
      });
    } else {
      const exists = chat.users.some((u) => u.uid === request.user.uid);
      if (!exists) {
        chat.users.push(request.user);
        await chat.save();
      }
    }
  }

  return NextResponse.json({ success: true, request: updated });
}

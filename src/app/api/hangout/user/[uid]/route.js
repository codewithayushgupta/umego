// app/api/hangout/user/[uid]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Hangout from '@/models/Hangout';

export async function GET(_, { params }) {
  await connectDB();
  const { uid } = params;
  const now = new Date();

  try {
    const hangouts = await Hangout.find({
      expiresAt: { $gt: now },
      $or: [
        { 'createdBy.uid': uid },
        { 'approvedMembers.uid': uid }
      ]
    }).sort({ dateTime: 1 });

    return NextResponse.json({ success: true, hangouts });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// app/api/hangout/list/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Hangout from '@/models/Hangout';

export async function GET() {
  await connectDB();
  const now = new Date();

  const hangouts = await Hangout.find({
    expiresAt: { $gt: now },
  }).sort({ dateTime: 1 });

  return NextResponse.json({ success: true, hangouts });
}

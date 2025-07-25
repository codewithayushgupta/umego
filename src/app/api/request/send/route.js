// app/api/request/send/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Request from '@/models/Request';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { hangoutId, user } = body;

  // Prevent duplicate requests
  const existing = await Request.findOne({ hangoutId, 'user.uid': user.uid });
  if (existing) {
    return NextResponse.json({ success: false, message: 'Already requested' }, { status: 400 });
  }

  const request = await Request.create({ hangoutId, user });
  return NextResponse.json({ success: true, request });
}

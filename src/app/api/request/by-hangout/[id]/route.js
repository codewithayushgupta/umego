// app/api/request/by-hangout/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Request from '@/models/Request';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  const requests = await Request.find({ hangoutId: id }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, requests });
}

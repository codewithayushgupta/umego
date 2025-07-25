import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Message from '@/models/Message';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { hangoutId, sender, text } = body;

  const message = await Message.create({ hangoutId, sender, text });
  return NextResponse.json({ success: true, message });
}

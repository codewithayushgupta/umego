import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Message from '@/models/Message';

export async function GET(req, { params }) {
  await connectDB();
  const { hangoutId } = params;
  const messages = await Message.find({ hangoutId }).sort({ createdAt: 1 });
  return NextResponse.json({ success: true, messages });
}

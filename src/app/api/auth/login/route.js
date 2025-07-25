// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const { uid, name, email, photoURL } = body;

  let user = await User.findOne({ uid });
  if (!user) {
    user = await User.create({ uid, name, email, photoURL });
  }

  return NextResponse.json({ success: true, user });
}

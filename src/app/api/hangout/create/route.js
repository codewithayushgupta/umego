// app/api/hangout/create/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongo';
import Hangout from '@/models/Hangout';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  try {
    const hangout = await Hangout.create(body);
    return NextResponse.json({ success: true, hangout });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

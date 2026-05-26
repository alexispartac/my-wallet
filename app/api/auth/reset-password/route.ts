import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import PasswordResetToken from '@/lib/models/PasswordResetToken';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  token:    z.string().min(64).max(64),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`reset:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe încercări' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { token, password } = parsed.data;

  try {
    await connectDB();
    const record = await PasswordResetToken.findOne({ token, used: false });
    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Link invalid sau expirat' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(record.userId, { passwordHash });
    record.used = true;
    await record.save();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

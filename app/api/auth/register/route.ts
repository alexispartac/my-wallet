import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  name:     z.string().min(2).max(80),
  email:    z.string().email(),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`register:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Prea multe încercări. Reîncearcă în 15 minute.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  try {
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'Există deja un cont cu acest email' }, { status: 409 });
    }
    const passwordHash   = await bcrypt.hash(password, 12);
    const avatarInitials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const colors         = ['#F59E0B', '#2563EB', '#16A34A', '#DC2626', '#8B5CF6', '#EA580C', '#0EA5E9', '#14B8A6'];
    const avatarColor    = colors[Math.floor(Math.random() * colors.length)];
    await User.create({ name: name.trim(), email: email.toLowerCase(), passwordHash, avatarColor, avatarInitials });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

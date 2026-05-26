import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  try {
    const { name, currentPassword, newPassword } = await req.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'Utilizator negăsit' }, { status: 404 });

    if (name) {
      user.name           = name.trim();
      user.avatarInitials = name.trim().split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    }

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'Introdu parola curentă' }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return NextResponse.json({ error: 'Parola curentă este greșită' }, { status: 400 });
      if (newPassword.length < 6) return NextResponse.json({ error: 'Parola nouă trebuie să aibă minim 6 caractere' }, { status: 400 });
      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    return NextResponse.json({ ok: true, name: user.name, avatarInitials: user.avatarInitials });
  } catch {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import Transaction from '@/lib/models/Transaction';
import Budget from '@/lib/models/Budget';
import PasswordResetToken from '@/lib/models/PasswordResetToken';

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const userId = session.user.id;
  try {
    await connectDB();
    await Promise.all([
      Transaction.deleteMany({ userId }),
      Budget.deleteMany({ userId }),
      PasswordResetToken.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Eroare server' }, { status: 500 });
  }
}

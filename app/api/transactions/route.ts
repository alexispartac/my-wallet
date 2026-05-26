import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';

const createSchema = z.object({
  type:     z.enum(['income', 'expense']),
  catId:    z.string().min(1).max(30),
  merchant: z.string().min(1).max(100),
  amount:   z.number().positive().max(10_000_000),
  date:     z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  note:     z.string().max(300).optional().default(''),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });
  try {
    await connectDB();
    const transactions = await Transaction.find({ userId: session.user.id }).sort({ date: -1 }).lean();
    return NextResponse.json(transactions.map(t => ({ ...t, _id: String(t._id) })));
  } catch {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide', details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await connectDB();
    const transaction = await Transaction.create({ ...parsed.data, userId: session.user.id });
    return NextResponse.json({ ...transaction.toObject(), _id: String(transaction._id) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

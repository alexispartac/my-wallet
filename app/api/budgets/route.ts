import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import Budget from '@/lib/models/Budget';

const DEFAULTS = [
  { catId: 'food',   limit: 1200 },
  { catId: 'trans',  limit: 350  },
  { catId: 'util',   limit: 600  },
  { catId: 'fun',    limit: 400  },
  { catId: 'home',   limit: 1800 },
  { catId: 'cafe',   limit: 250  },
  { catId: 'cloth',  limit: 300  },
  { catId: 'health', limit: 200  },
];

const upsertSchema = z.object({
  catId: z.string().min(1).max(30),
  limit: z.number().positive().max(10_000_000),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  await connectDB();
  const userId = session.user.id;
  let budgets = await Budget.find({ userId }).lean();
  if (budgets.length === 0) {
    const inserted = await Budget.insertMany(DEFAULTS.map(d => ({ ...d, userId })));
    budgets = inserted.map(b => (b as typeof inserted[number]).toObject());
  }
  return NextResponse.json(budgets.map(b => ({ ...b, _id: String(b._id) })));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
  }

  await connectDB();
  const { catId, limit } = parsed.data;
  const userId = session.user.id;
  const budget = await Budget.findOneAndUpdate(
    { catId, userId },
    { catId, limit, userId },
    { upsert: true, new: true }
  );
  return NextResponse.json({ ...budget.toObject(), _id: String(budget._id) }, { status: 201 });
}

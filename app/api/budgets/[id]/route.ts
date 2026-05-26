import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import Budget from '@/lib/models/Budget';

const updateSchema = z.object({
  limit: z.number().positive().max(10_000_000),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  await connectDB();
  const { id } = await params;
  const budget = await Budget.findOneAndUpdate({ _id: id, userId: session.user.id }, parsed.data, { new: true });
  if (!budget) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...budget.toObject(), _id: String(budget._id) });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const budget = await Budget.findOne({ _id: id, userId: session.user.id });
  if (!budget) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await budget.deleteOne();
  return NextResponse.json({ ok: true });
}

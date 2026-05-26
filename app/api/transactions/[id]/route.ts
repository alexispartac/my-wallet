import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const tx = await Transaction.findOne({ _id: id, userId: session.user.id });
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await tx.deleteOne();
  return NextResponse.json({ ok: true });
}

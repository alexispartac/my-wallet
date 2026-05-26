import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { Resend } from 'resend';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import PasswordResetToken from '@/lib/models/PasswordResetToken';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`forgot:${ip}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: true }); // silent rate limit — don't leak info
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: true }); // always 200

  const { email } = parsed.data;

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const token     = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await PasswordResetToken.deleteMany({ userId: String(user._id) });
      await PasswordResetToken.create({ userId: String(user._id), token, expiresAt });

      const baseUrl  = process.env.AUTH_URL ?? 'http://localhost:3000';
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    process.env.RESEND_FROM ?? 'MoneyFlow <noreply@moneyflow.app>',
        to:      user.email,
        subject: 'Resetează parola MoneyFlow',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="font-size: 32px;">💰</div>
              <h1 style="font-size: 22px; font-weight: 800; color: #1A3C5E; margin: 8px 0 4px;">MoneyFlow</h1>
            </div>
            <h2 style="font-size: 18px; font-weight: 700; color: #1A3C5E;">Resetează parola</h2>
            <p style="color: #64748B; line-height: 1.6;">Ai solicitat resetarea parolei. Apasă butonul de mai jos — linkul este valabil <strong>1 oră</strong>.</p>
            <a href="${resetUrl}" style="display: block; margin: 24px 0; padding: 14px 24px; background: linear-gradient(135deg, #1A3C5E, #2563EB); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; text-align: center; font-size: 15px;">
              Resetează parola
            </a>
            <p style="color: #94A3B8; font-size: 12px;">Dacă nu ai solicitat această resetare, ignoră acest email. Parola ta nu se schimbă.</p>
          </div>
        `,
      });
    }
  } catch (err) {
    console.error('forgot-password error:', err);
  }

  return NextResponse.json({ ok: true });
}

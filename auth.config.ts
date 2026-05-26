import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn  = !!auth?.user;
      const { pathname } = nextUrl;
      const isAuthPage  = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname)
        || pathname.startsWith('/reset-password');
      const isApiAuth   = pathname.startsWith('/api/auth');

      if (isApiAuth) return true;
      if (isAuthPage) {
        return isLoggedIn ? Response.redirect(new URL('/', nextUrl)) : true;
      }
      return isLoggedIn;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id             = user.id;
        token.avatarColor    = (user as { avatarColor?: string }).avatarColor;
        token.avatarInitials = (user as { avatarInitials?: string }).avatarInitials;
      }
      if (trigger === 'update' && session) {
        if (session.name)           { token.name = session.name; }
        if (session.avatarInitials) { token.avatarInitials = session.avatarInitials; }
      }
      return token;
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id             = token.id as string;
        session.user.avatarColor    = token.avatarColor    as string;
        session.user.avatarInitials = token.avatarInitials as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

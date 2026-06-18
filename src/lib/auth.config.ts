import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isDashboard = pathname.startsWith("/dashboard");
      const isAuthPage =
        pathname === "/login" || pathname === "/register";

      if (isDashboard && !isLoggedIn) return false;
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", request.nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.merchantId = user.id;
        token.slug = (user as { slug?: string }).slug;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.merchantId as string;
        session.user.slug = token.slug as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

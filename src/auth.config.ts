import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        // Dynamic import to avoid edge runtime issues
        const { db } = await import("@/db");
        const { users } = await import("@/db/schema");
        const { eq } = await import("drizzle-orm");
        const bcrypt = await import("bcryptjs");

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email))
          .limit(1);

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname === "/" ||
        nextUrl.pathname.startsWith("/environmental") ||
        nextUrl.pathname.startsWith("/social") ||
        nextUrl.pathname.startsWith("/governance") ||
        nextUrl.pathname.startsWith("/gamification") ||
        nextUrl.pathname.startsWith("/settings") ||
        nextUrl.pathname.startsWith("/reports");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

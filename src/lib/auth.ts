import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        login: { label: "Login ou e-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.login?.trim();
        const password = credentials?.password;

        if (!login || !password) {
          return null;
        }

        const admin = await prisma.adminUser.findFirst({
          where: {
            active: true,
            role: "ADMIN",
            OR: [{ username: login }, { email: login.toLowerCase() }],
          },
        });

        if (!admin) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.name ?? admin.username,
          email: admin.email ?? undefined,
          role: admin.role,
          username: admin.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role;
        session.user.username = token.username;
      }

      return session;
    },
  },
};

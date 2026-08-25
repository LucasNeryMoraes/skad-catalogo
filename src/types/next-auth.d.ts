import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN";
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN";
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "ADMIN";
    username?: string;
  }
}

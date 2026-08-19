import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // Mock authorization for snapshot purposes
        if (credentials.email === "student@test.com") {
          return { id: "1", name: "Test Student", email: "student@test.com", role: "student" };
        }
        return null;
      }
    })
  ]
});

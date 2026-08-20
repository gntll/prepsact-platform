import NextAuth from "next-auth";
// ... your other providers (e.g., GitHub, Google, Credentials)

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET, // Explicitly define it here
  providers: [
    // ... your providers configuration
  ],
});

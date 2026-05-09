import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth";

function getBaseUrl(req) {
  const proto = req?.headers?.["x-forwarded-proto"] || "http";
  const host = req?.headers?.host || "localhost:3000";
  return `${proto}://${host}`;
}

export default NextAuth({
  ...authOptions,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;

        if (!username || !password) return null;

        const res = await fetch(`${getBaseUrl(req)}/api/mock/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) return null;

        return {
          id: username,
          name: username,
          role: data.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpires: Date.now() + data.expiresIn * 1000,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});


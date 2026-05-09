function getBaseUrlFromEnv() {
  const url = process.env.NEXTAUTH_URL;
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}

async function refreshAccessToken(token) {
  try {
    const res = await fetch(`${getBaseUrlFromEnv()}/api/mock/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "REFRESH_FAILED");
    }

    return {
      ...token,
      accessToken: data.accessToken,
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
      refreshToken: data.refreshToken ?? token.refreshToken,
      error: undefined,
    };
  } catch (e) {
    return { ...token, error: "REFRESH_FAILED" };
  }
}

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      // First time sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.accessTokenExpires = user.accessTokenExpires;
        return token;
      }

      // Still valid
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Expired -> refresh
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }

      return { ...token, error: "NO_REFRESH_TOKEN" };
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.role = token.role;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
};


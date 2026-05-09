const USERS = {
  student: { password: "123456", role: "ROLE_STUDENT" },
  advisor: { password: "123456", role: "ROLE_ADVISOR" },
};

function makeAccessToken() {
  // embed issuedAt for expiry checks in mock backend
  return `access_token_${Date.now()}`;
}

function makeRefreshToken() {
  return `refresh_token_${Date.now()}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const { username, password } = req.body || {};
  const user = USERS[String(username || "").toLowerCase()];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }

  // Access token: 60s, refresh token: 1 day (demo)
  return res.status(200).json({
    role: user.role,
    accessToken: makeAccessToken(),
    refreshToken: makeRefreshToken(),
    expiresIn: 60,
  });
}


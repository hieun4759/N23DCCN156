function parseIssuedAtFromToken(prefix, token) {
  if (!token || typeof token !== "string") return null;
  if (!token.startsWith(prefix)) return null;
  const n = Number(token.slice(prefix.length));
  return Number.isFinite(n) ? n : null;
}

function makeAccessToken() {
  return `access_token_${Date.now()}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const { refreshToken } = req.body || {};
  const issuedAt = parseIssuedAtFromToken("refresh_token_", refreshToken);

  if (!issuedAt) return res.status(401).json({ error: "INVALID_REFRESH_TOKEN" });

  const ageMs = Date.now() - issuedAt;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (ageMs > oneDayMs) return res.status(401).json({ error: "REFRESH_TOKEN_EXPIRED" });

  return res.status(200).json({
    accessToken: makeAccessToken(),
    expiresIn: 60,
  });
}


function parseIssuedAtFromToken(prefix, token) {
  if (!token || typeof token !== "string") return null;
  if (!token.startsWith(prefix)) return null;
  const n = Number(token.slice(prefix.length));
  return Number.isFinite(n) ? n : null;
}

export default async function handler(req, res) {
  const auth = req.headers.authorization || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const accessToken = m?.[1];

  if (!accessToken) return res.status(401).json({ error: "MISSING_ACCESS_TOKEN" });

  const issuedAt = parseIssuedAtFromToken("access_token_", accessToken);
  if (!issuedAt) return res.status(401).json({ error: "INVALID_ACCESS_TOKEN" });

  const ageMs = Date.now() - issuedAt;
  if (ageMs > 60 * 1000) return res.status(401).json({ error: "ACCESS_TOKEN_EXPIRED" });

  return res.status(200).json({
    classes: [
      { id: 1, name: "Lớp A1", students: 30 },
      { id: 2, name: "Lớp A2", students: 28 },
      { id: 3, name: "Lớp A3", students: 32 },
    ],
    accessToken,
    expiresAt: new Date(issuedAt + 60 * 1000).toISOString(),
    timestamp: new Date().toISOString(),
  });
}


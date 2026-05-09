import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function getBaseUrl(req) {
  const proto = req?.headers?.["x-forwarded-proto"] || "http";
  const host = req?.headers?.host || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "UNAUTHORIZED" });
  if (session.role !== "ROLE_ADVISOR") return res.status(403).json({ error: "FORBIDDEN", role: session.role });

  const upstream = await fetch(`${getBaseUrl(req)}/api/mock/classes`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = await upstream.json();
  return res.status(upstream.status).json(data);
}


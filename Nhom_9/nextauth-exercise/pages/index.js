import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function formatToken(token) {
  if (!token) return "-";
  return token.length > 24 ? `${token.slice(0, 16)}...${token.slice(-6)}` : token;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const secondsLeft = useMemo(() => {
    if (!session?.accessTokenExpires) return null;
    return Math.max(0, Math.floor((session.accessTokenExpires - Date.now()) / 1000));
  }, [session?.accessTokenExpires]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [router, status]);

  const canAccess = session?.role === "ROLE_ADVISOR";

  async function handleFetchClasses() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setResult({ ok: res.ok, status: res.status, data });
    } catch (e) {
      setResult({ ok: false, status: 0, data: { error: "NETWORK_ERROR" } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        <div className="container">
          <div className="hero">
            <div className="heroBar">Demo: Token Refresh Tự Động</div>
            <div className="heroBody">
              <div className="grid">
                <div className="card">
                  <div className="cardTitle">Tài khoản demo</div>
                  <div className="muted small">
                    Student: <code>student</code> / <code>123456</code> (ROLE_STUDENT)
                    <br />
                    Advisor: <code>advisor</code> / <code>123456</code> (ROLE_ADVISOR)
                  </div>
                  <div className="divider" />
                  <div className="muted small">
                    Yêu cầu: Dashboard (/) chỉ cho <b>ROLE_ADVISOR</b> truy cập. Access token sống 60s, tự refresh bằng refresh token.
                  </div>
                </div>

                <div className="card">
                  <div className="cardTitle">Trạng thái phiên</div>
                  {status === "loading" ? (
                    <div className="muted">Đang tải session...</div>
                  ) : session ? (
                    <>
                      <div className="kv">
                        <div className="k">Người dùng</div>
                        <div className="v">{session.user?.name}</div>
                        <div className="k">Role</div>
                        <div className="v">
                          <span className={`pill ${canAccess ? "pillOk" : "pillWarn"}`}>{session.role}</span>
                        </div>
                        <div className="k">Access token hết hạn sau</div>
                        <div className="v">{secondsLeft === null ? "-" : `${secondsLeft}s`}</div>
                        <div className="k">Token hiện tại</div>
                        <div className="v">
                          <code>{formatToken(session.accessToken)}</code>
                        </div>
                      </div>
                      {session.error ? <div className="alert alertWarn">Token error: {session.error}</div> : null}
                      <div className="row">
                        <button className="btn btnPrimary" onClick={handleFetchClasses} disabled={!canAccess || loading}>
                          {loading ? "Đang gọi API..." : "Lấy danh sách lớp"}
                        </button>
                        <button className="btn btnDanger" onClick={() => signOut({ callbackUrl: "/login" })}>
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="muted">Chưa đăng nhập.</div>
                  )}
                </div>
              </div>

              {!session ? null : canAccess ? null : (
                <div className="card denied">
                  <div className="cardTitle" style={{ color: "#b42318" }}>
                    Bị từ chối truy cập
                  </div>
                  <div className="muted">
                    Bạn không có quyền truy cập trang này. Chỉ Cố Vấn (ROLE_ADVISOR) mới được phép.
                  </div>
                  <div className="divider" />
                  <div className="muted">
                    Role của bạn: <span className="pill pillWarn">{session.role}</span>
                  </div>
                </div>
              )}

              {result ? (
                <div className={`card result ${result.ok ? "ok" : "bad"}`}>
                  <div className="cardTitle">Kết quả</div>
                  <div className="muted small">HTTP {result.status}</div>
                  <pre className="pre">{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

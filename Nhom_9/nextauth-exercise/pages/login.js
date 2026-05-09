import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [router, status]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: "/",
    });

    if (!res?.ok) {
      setError("Sai tài khoản hoặc mật khẩu.");
      setLoading(false);
      return;
    }

    router.push(res.url || "/");
  }

  return (
    <>
      <Head>
        <title>Đăng nhập</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page">
        <div className="container narrow">
          <div className="hero">
            <div className="heroBar">Đăng nhập &amp; Lưu trữ 2 Token</div>
            <div className="heroBody">
              <div className="card">
                <div className="center">
                  <div className="lockIcon" aria-hidden="true" />
                  <div className="cardTitle">Đăng nhập</div>
                </div>

                <form onSubmit={onSubmit} className="form">
                  <label className="label">
                    Username
                    <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="student / advisor" />
                  </label>
                  <label className="label">
                    Password
                    <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="123456" />
                  </label>

                  {error ? <div className="alert alertBad">{error}</div> : null}

                  <button className="btn btnPrimary full" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </form>

                <div className="divider" />
                <div className="muted small">
                  Demo Credentials:
                  <br />
                  Student: <code>student</code> / <code>123456</code> (ROLE_STUDENT)
                  <br />
                  Advisor: <code>advisor</code> / <code>123456</code> (ROLE_ADVISOR)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


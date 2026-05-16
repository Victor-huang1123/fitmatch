"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState("");

  async function submit(phone: string, password: string) {
    try {
      await login(phone, password);
      router.push(searchParams.get("next") || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    }
  }

  return (
    <main className="page">
      <div className="section-head"><div><p className="eyebrow">會員登入</p><h1>登入 FitMatch</h1></div></div>
      <form className="panel list" onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        submit(String(form.get("phone") || ""), String(form.get("password") || ""));
      }}>
        <div className="auth-grid">
          <label><span>手機</span><input name="phone" inputMode="numeric" maxLength={10} required /></label>
          <label><span>密碼</span><input name="password" type="password" required /></label>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="actions">
          <button className="btn" type="submit">登入</button>
          <button className="btn secondary" type="button" onClick={() => submit("0912000000", "password123")}>Demo 學員</button>
          <button className="btn secondary" type="button" onClick={() => submit("0999000000", "password123")}>Demo 商家</button>
          <Link className="btn ghost" href="/register">註冊</Link>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page"><p className="muted">載入中...</p></main>}>
      <LoginContent />
    </Suspense>
  );
}

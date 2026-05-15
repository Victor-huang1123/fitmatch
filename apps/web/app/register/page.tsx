"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState("");

  return (
    <main className="page">
      <div className="section-head"><div><p className="eyebrow">新會員</p><h1>建立學員帳號</h1></div></div>
      <form className="panel list" onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const form = new FormData(event.currentTarget);
        const password = String(form.get("password") || "");
        if (password !== String(form.get("confirmPassword") || "")) return setError("兩次密碼不一致。");
        if (String(form.get("code") || "") !== "000000") return setError("Demo 驗證碼固定為 000000。");
        try {
          await register({ name: String(form.get("name")), phone: String(form.get("phone")), email: String(form.get("email") || ""), password });
          router.push("/");
        } catch (err) {
          setError(err instanceof Error ? err.message : "註冊失敗");
        }
      }}>
        <div className="auth-grid">
          <label><span>姓名</span><input name="name" required /></label>
          <label><span>手機</span><input name="phone" inputMode="numeric" maxLength={10} required /></label>
          <label><span>Email 選填</span><input name="email" type="email" /></label>
          <label><span>密碼</span><input name="password" type="password" minLength={8} required /></label>
          <label><span>再次輸入密碼</span><input name="confirmPassword" type="password" minLength={8} required /></label>
          <label><span>驗證碼</span><input name="code" placeholder="000000" maxLength={6} required /></label>
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit">完成註冊</button>
      </form>
    </main>
  );
}

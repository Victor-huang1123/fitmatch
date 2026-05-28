"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";

function LoginContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await login(phone, password);
      router.push(sp.get("next") || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setLoading(false);
    }
  }

  async function demoLogin(demoPhone: string) {
    setLoading(true); setError("");
    try {
      await login(demoPhone, "password123");
      router.push(sp.get("next") || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero */}
      <div style={{ background: "linear-gradient(145deg,#00677d 0%,#004e5f 60%,#003040 100%)" }} className="px-6 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-white" style={{ fontSize: "32px", fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
        </div>
        <h1 className="text-xl font-bold text-white">FitMatch</h1>
        <p className="text-sm text-white/70 mt-1">健身媒合平台</p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-6 max-w-sm mx-auto w-full">
        <div>
          <h2 className="text-lg font-bold text-on-surface">歡迎回來</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">登入你的帳號繼續</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant">手機號碼</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
              placeholder="0912345678"
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-border-subtle text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant">密碼</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="至少 8 個字元"
              className="w-full px-4 py-3 rounded-xl bg-surface-container border border-border-subtle text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-status-danger/5 border border-status-danger/20 rounded-xl px-3 py-2">
              <span className="material-symbols-outlined text-status-danger" style={{ fontSize: "15px" }}>error</span>
              <p className="text-xs text-status-danger">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-60 transition-opacity">
            {loading ? "登入中…" : "登入"}
          </button>
        </form>

        {/* Demo accounts */}
        <div className="space-y-2">
          <p className="text-xs text-center text-on-surface-variant">快速體驗 Demo 帳號</p>
          <div className="flex gap-2">
            <button onClick={() => demoLogin("0912000000")} disabled={loading}
              className="flex-1 py-2.5 border border-border-subtle rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50 transition-colors">
              Demo 學員
            </button>
            <button onClick={() => demoLogin("0999000000")} disabled={loading}
              className="flex-1 py-2.5 border border-border-subtle rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low disabled:opacity-50 transition-colors">
              Demo 商家
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant">
          還沒有帳號？{" "}
          <Link href="/register" className="text-primary font-semibold">立即註冊</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><span className="text-sm text-on-surface-variant">載入中…</span></div>}>
      <LoginContent />
    </Suspense>
  );
}

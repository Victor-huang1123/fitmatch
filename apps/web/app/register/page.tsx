"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("兩次密碼不一致"); return; }
    if (form.password.length < 8) { setError("密碼至少 8 個字元"); return; }
    setLoading(true); setError("");
    try {
      await register({ name: form.name, phone: form.phone, email: form.email || undefined, password: form.password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "註冊失敗");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div style={{ background: "linear-gradient(145deg,#00677d 0%,#004e5f 60%,#003040 100%)" }} className="px-6 pt-14 pb-10 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-white" style={{ fontSize: "28px", fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
        </div>
        <h1 className="text-lg font-bold text-white">建立帳號</h1>
        <p className="text-xs text-white/70 mt-1">加入 FitMatch 開始你的運動旅程</p>
      </div>

      <div className="flex-1 px-6 py-8 space-y-4 max-w-sm mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: "姓名", key: "name", type: "text", placeholder: "你的名字", required: true },
            { label: "手機號碼", key: "phone", type: "tel", placeholder: "0912345678", required: true },
            { label: "Email（選填）", key: "email", type: "email", placeholder: "example@mail.com", required: false },
            { label: "密碼", key: "password", type: "password", placeholder: "至少 8 個字元", required: true },
            { label: "確認密碼", key: "confirm", type: "password", placeholder: "再輸入一次密碼", required: true },
          ].map(({ label, key, type, placeholder, required }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">{label}</label>
              <input type={type} placeholder={placeholder} required={required}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-surface-container border border-border-subtle text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none focus:border-primary transition-colors" />
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 bg-status-danger/5 border border-status-danger/20 rounded-xl px-3 py-2">
              <span className="material-symbols-outlined text-status-danger" style={{ fontSize: "15px" }}>error</span>
              <p className="text-xs text-status-danger">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-xl text-sm font-bold disabled:opacity-60 mt-2">
            {loading ? "建立中…" : "建立帳號"}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface-variant">
          已有帳號？{" "}
          <Link href="/login" className="text-primary font-semibold">立即登入</Link>
        </p>
      </div>
    </div>
  );
}

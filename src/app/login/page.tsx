"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import {
  AuthDivider,
  AuthField,
  AuthPasswordField,
  AuthSplitShell,
  AuthSubmit,
} from "@/components/auth/auth-ui";
import { SocialLogin } from "@/components/auth/social-login";
import { FadeIn } from "@/components/motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthSplitShell>
      <FadeIn>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับหน้าแรก
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface">
                <Calendar className="h-5 w-5 text-heading" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-semibold tracking-tight text-heading">
                BookFlow
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
              ยินดีต้อนรับกลับ
            </h1>
            <p className="mt-2 text-sm text-muted sm:text-base">
              เข้าสู่ระบบเพื่อจัดการคิวและร้านของคุณ
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthField
                id="email"
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <div>
                <AuthPasswordField
                  id="password"
                  label="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    className="text-sm text-muted transition hover:text-heading"
                    onClick={() =>
                      alert("ฟีเจอร์ลืมรหัสผ่านจะเปิดใช้งานเร็วๆ นี้")
                    }
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <AuthSubmit loading={loading}>เข้าสู่ระบบ</AuthSubmit>
            </form>

            <AuthDivider label="หรือเข้าสู่ระบบด้วย" />
            <SocialLogin mode="login" />
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/register"
              className="font-medium text-heading underline-offset-4 hover:underline"
            >
              สมัครใช้งานฟรี
            </Link>
          </p>
        </div>
      </FadeIn>
    </AuthSplitShell>
  );
}

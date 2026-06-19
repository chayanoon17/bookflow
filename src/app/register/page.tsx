"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { slugify } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    slug: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "shopName" && !prev.slug) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        shopName: form.shopName,
        slug: form.slug,
        phone: form.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthSplitShell>
      <FadeIn>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link
              href="/login"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-heading"
            >
              <ArrowLeft className="h-4 w-4" />
              เข้าสู่ระบบ
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
              สร้างร้านของคุณ
            </h1>
            <p className="mt-2 text-sm text-muted sm:text-base">
              สมัครฟรี ตั้งร้านแล้วรับจองได้ทันที
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <AuthField
                id="email"
                label="อีเมล"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
              <AuthPasswordField
                id="password"
                label="รหัสผ่าน"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <AuthPasswordField
                id="confirmPassword"
                label="ยืนยันรหัสผ่าน"
                value={form.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
              />

              <div className="border-t border-border pt-5">
                <p className="mb-4 text-sm font-medium text-heading">
                  ข้อมูลร้าน
                </p>
                <div className="space-y-5">
                  <AuthField
                    id="shopName"
                    label="ชื่อร้าน"
                    value={form.shopName}
                    onChange={(e) => updateField("shopName", e.target.value)}
                    required
                    placeholder="ร้านทำเล็บสวย"
                  />
                  <div>
                    <AuthField
                      id="slug"
                      label="ลิงก์จอง"
                      value={form.slug}
                      onChange={(e) =>
                        updateField("slug", slugify(e.target.value))
                      }
                      required
                      placeholder="my-nail-shop"
                    />
                    <p className="mt-2 text-xs text-muted">
                      bookflow.app/{form.slug || "your-shop"}
                    </p>
                  </div>
                  <AuthField
                    id="phone"
                    label="เบอร์โทร (ไม่บังคับ)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              <AuthSubmit loading={loading}>สมัครใช้งาน</AuthSubmit>
            </form>

            <AuthDivider label="หรือสมัครด้วย" />
            <SocialLogin mode="register" />
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="font-medium text-heading underline-offset-4 hover:underline"
            >
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </FadeIn>
    </AuthSplitShell>
  );
}

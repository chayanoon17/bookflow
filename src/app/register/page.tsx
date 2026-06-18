"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import {
  AuthDivider,
  AuthField,
  AuthLogo,
  AuthPasswordField,
  AuthShell,
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
    <AuthShell>
      <FadeIn className="flex flex-1 flex-col">
        <div className="relative mb-8 flex items-center justify-center">
          <Link
            href="/login"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
            aria-label="Back to login"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <AuthLogo />
        </div>

        <h1 className="mb-8 text-center text-xl font-semibold text-gray-900">
          Create your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthPasswordField
            id="password"
            label="Password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="••••••••"
          />
          <AuthPasswordField
            id="confirmPassword"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="••••••••"
          />

          <div className="border-t border-gray-100 pt-2">
            <p className="mb-4 text-sm font-medium text-gray-500">
              ข้อมูลร้าน
            </p>
            <div className="space-y-5">
              <AuthField
                id="shopName"
                label="Shop name"
                value={form.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                required
                placeholder="My Nail Shop"
              />
              <div>
                <AuthField
                  id="slug"
                  label="Shop URL"
                  value={form.slug}
                  onChange={(e) => updateField("slug", slugify(e.target.value))}
                  required
                  placeholder="my-nail-shop"
                />
                <p className="mt-2 text-xs text-gray-400">
                  bookflow.app/{form.slug || "your-shop"}
                </p>
              </div>
              <AuthField
                id="phone"
                label="Phone (optional)"
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
          <AuthSubmit loading={loading}>Sign up</AuthSubmit>
        </form>

        <AuthDivider label="Or sign up with" />
        <SocialLogin mode="register" />

        <p className="mt-auto pt-10 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--auth-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </FadeIn>
    </AuthShell>
  );
}

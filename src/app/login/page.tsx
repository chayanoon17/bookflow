"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    <AuthShell>
      <FadeIn className="flex flex-1 flex-col">
        <AuthLogo className="mb-10" />

        <h1 className="mb-8 text-center text-xl font-semibold text-gray-900">
          Login to your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthPasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <AuthSubmit loading={loading}>Sign in</AuthSubmit>
        </form>

        <AuthDivider label="Or sign in with" />
        <SocialLogin mode="login" />

        <p className="mt-auto pt-10 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--auth-primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </FadeIn>
    </AuthShell>
  );
}

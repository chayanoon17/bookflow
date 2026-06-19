"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Check, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthLogo({
  variant = "color",
  className,
  size = "default",
}: {
  variant?: "color" | "white";
  className?: string;
  size?: "default" | "sm";
}) {
  const dot = variant === "white" ? "bg-white/90" : "bg-heading";
  const text = variant === "white" ? "text-white" : "text-heading";
  const dotSize = size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5";
  const textSize = size === "sm" ? "text-lg font-semibold" : "text-[1.75rem] font-bold";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("mb-2 flex gap-1.5", size === "sm" && "mb-1.5")}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={cn("rounded-full", dotSize, dot)} />
        ))}
      </div>
      <span className={cn("tracking-tight", textSize, text)}>BookFlow</span>
    </div>
  );
}

const BRAND_POINTS = [
  "แชร์ลิงก์จองให้ลูกค้าได้ทันที",
  "จัดการคิวและบริการในที่เดียว",
  "เหมาะกับร้าน SME ขนาดเล็ก",
];

export function AuthBrandPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden bg-pastel-cream p-8 lg:p-12",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-pastel-pink/60 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-pastel-blue/50 blur-2xl" />

      <div className="relative">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-heading"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าแรก
        </Link>

        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-surface/80">
            <Calendar className="h-5 w-5 text-heading" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-semibold tracking-tight text-heading">
            BookFlow
          </span>
        </div>

        <p className="text-sm font-medium text-muted">ระบบจองคิวสำหรับร้าน SME</p>
        <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-heading lg:text-3xl">
          จัดการคิวร้าน
          <br />
          ง่ายขึ้นในที่เดียว
        </h2>
      </div>

      <div className="relative mt-10 space-y-3 lg:mt-0">
        {BRAND_POINTS.map((point) => (
          <div key={point} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pastel-mint">
              <Check className="h-3 w-3 text-heading" strokeWidth={2.5} />
            </span>
            <span className="text-sm leading-relaxed text-foreground">{point}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-10 hidden gap-3 sm:grid sm:grid-cols-3 lg:mt-12">
        {[
          { color: "bg-pastel-pink", label: "จอง" },
          { color: "bg-pastel-mint", label: "คิว" },
          { color: "bg-pastel-blue", label: "ร้าน" },
        ].map(({ color, label }) => (
          <div
            key={label}
            className={cn(
              "flex h-20 items-center justify-center rounded-xl border border-border/40",
              color
            )}
          >
            <span className="text-sm font-medium text-heading/70">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthSplitShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("auth-theme min-h-screen bg-background lg:grid lg:grid-cols-2", className)}>
      <AuthBrandPanel className="hidden lg:flex" />
      <div className="flex min-h-screen flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
        {children}
      </div>
    </div>
  );
}

export function AuthShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "auth-theme flex min-h-screen flex-col bg-background",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center px-6 py-10">
        {children}
      </div>
    </div>
  );
}

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-sm",
        className
      )}
    >
      <div className="flex h-20 items-center justify-center border-b border-border bg-pastel-mint">
        <AuthLogo />
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-7 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-sm text-muted">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthField({
  id,
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-heading">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-base text-heading outline-none transition placeholder:text-muted focus:border-heading focus:ring-2 focus:ring-heading/10",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/15"
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function AuthPasswordField({
  id,
  label,
  error,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-heading">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border border-border bg-surface py-3.5 pl-4 pr-12 text-base text-heading outline-none transition placeholder:text-muted focus:border-heading focus:ring-2 focus:ring-heading/10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/15"
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:bg-primary-muted hover:text-foreground"
          aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function AuthSubmit({
  children,
  loading,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className={cn(
        "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}

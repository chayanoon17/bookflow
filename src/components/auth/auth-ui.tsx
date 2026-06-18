"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthLogo({
  variant = "color",
  className,
}: {
  variant?: "color" | "white";
  className?: string;
}) {
  const dot =
    variant === "white" ? "bg-white/90" : "bg-[var(--auth-primary)]";
  const text = variant === "white" ? "text-white" : "text-[var(--auth-primary)]";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="mb-2 flex gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        ))}
      </div>
      <span className={cn("text-[1.75rem] font-bold tracking-tight", text)}>
        BookFlow
      </span>
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
        "auth-theme flex min-h-screen flex-col bg-white",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-6 pb-10 pt-14">
        {children}
      </div>
    </div>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-7 flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--auth-primary)] focus:ring-2 focus:ring-[var(--auth-primary)]/15",
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
      <label htmlFor={id} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-12 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--auth-primary)] focus:ring-2 focus:ring-[var(--auth-primary)]/15",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/15"
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
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
        "mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--auth-primary)] py-3.5 text-base font-semibold text-white transition hover:bg-[var(--auth-primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
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

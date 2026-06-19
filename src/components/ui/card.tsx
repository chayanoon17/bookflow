import { cn } from "@/lib/utils";

export const PASTEL_VARIANTS = {
  pink: "bg-pastel-pink",
  mint: "bg-pastel-mint",
  blue: "bg-pastel-blue",
  cream: "bg-pastel-cream",
} as const;

export type PastelVariant = keyof typeof PASTEL_VARIANTS;

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  pastel = "mint",
  className,
}: {
  title: string;
  description?: string;
  pastel?: PastelVariant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-b border-border px-5 py-4",
        PASTEL_VARIANTS[pastel],
        className
      )}
    >
      <h2 className="font-medium text-heading">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-muted">{description}</p>
      )}
    </div>
  );
}

export function PastelCard({
  title,
  description,
  pastel = "mint",
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  pastel?: PastelVariant;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-sm",
        className
      )}
    >
      <CardHeader title={title} description={description} pastel={pastel} />
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}

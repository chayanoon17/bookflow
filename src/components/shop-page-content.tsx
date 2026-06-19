"use client";

import Link from "next/link";
import {
  CalendarClock,
  Clock,
  MapPin,
  Phone,
  Scissors,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { MotionPress, StaggerItem, StaggerList } from "@/components/motion";
import { getDayKey, parseWorkingHours } from "@/lib/slots";
import { cn, formatPhone, formatPriceTHB } from "@/lib/utils";

const PASTELS = [
  "bg-pastel-pink",
  "bg-pastel-mint",
  "bg-pastel-blue",
  "bg-pastel-cream",
] as const;

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}

interface Props {
  shopSlug: string;
  shopName: string;
  phone: string | null;
  logoUrl: string | null;
  workingHours: unknown;
  services: Service[];
}

function getTodayStatus(workingHours: unknown) {
  const hours = parseWorkingHours(workingHours);
  const today = getDayKey(new Date());
  const schedule = hours[today];

  if (!schedule?.open) {
    return { open: false, label: "ปิดทำการวันนี้" };
  }

  return {
    open: true,
    label: `เปิดวันนี้ ${schedule.start ?? "09:00"} – ${schedule.end ?? "18:00"}`,
  };
}

export function ShopPageContent({
  shopSlug,
  shopName,
  phone,
  logoUrl,
  workingHours,
  services,
}: Props) {
  const todayStatus = getTodayStatus(workingHours);
  const formattedPhone = phone ? formatPhone(phone) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-pastel-mint px-4 pb-8 pt-10">
        <BlurFade delay={0} duration={0.45}>
          <p className="text-center text-sm font-medium text-foreground">
            จองคิวออนไลน์
          </p>
          <h1 className="mt-1 text-center text-2xl font-semibold tracking-tight text-heading">
            {shopName}
          </h1>
        </BlurFade>
      </div>

      <div className="relative mx-auto max-w-lg px-4 pb-10">
        <BlurFade delay={0.08} duration={0.5} className="-mt-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="p-5">
              <div className="flex items-start gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={shopName}
                    className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-pastel-blue text-xl font-semibold text-heading">
                    {shopName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-lg font-medium text-heading">
                    {shopName}
                  </p>
                  <span
                    className={cn(
                      "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      todayStatus.open
                        ? "bg-pastel-mint text-heading"
                        : "bg-primary-muted text-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        todayStatus.open ? "bg-foreground" : "bg-muted"
                      )}
                    />
                    {todayStatus.label}
                  </span>
                </div>
              </div>

              {formattedPhone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-primary-muted px-4 py-2.5 text-sm font-medium text-heading transition hover:bg-border/50"
                >
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                  {formattedPhone}
                </a>
              )}
            </div>

            <div className="border-t border-border bg-primary-muted/50 px-5 py-2.5">
              <p className="flex items-center gap-2 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                bookflow.app/{shopSlug}
              </p>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.15} duration={0.5} className="mt-8">
          <h2 className="text-lg font-medium text-heading">บริการ</h2>
          <p className="mt-0.5 text-sm text-muted">
            เลือกบริการแล้วจองเวลาได้ทันที
          </p>
        </BlurFade>

        {services.length === 0 ? (
          <BlurFade delay={0.2} duration={0.5} className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-dashed border-border bg-surface">
              <div className="flex h-28 items-center justify-center bg-pastel-cream">
                <CalendarClock
                  className="h-12 w-12 text-foreground/60"
                  strokeWidth={1.25}
                />
              </div>
              <div className="p-8 text-center">
                <p className="font-medium text-heading">ยังไม่มีบริการเปิดจอง</p>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                  ร้านกำลังเตรียมบริการอยู่ ลองติดต่อร้านโดยตรงได้เลย
                </p>
                {formattedPhone && (
                  <a href={`tel:${phone}`} className="mt-6 inline-block">
                    <Button variant="outline">
                      <Phone className="h-4 w-4" />
                      โทรสอบถาม
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </BlurFade>
        ) : (
          <StaggerList className="mt-4 space-y-4">
            {services.map((service, index) => (
              <StaggerItem key={service.id}>
                <MotionPress>
                  <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:shadow-md">
                    <div
                      className={cn(
                        "flex h-20 items-center justify-center border-b border-border/50",
                        PASTELS[index % PASTELS.length]
                      )}
                    >
                      <Scissors
                        className="h-10 w-10 text-heading/40"
                        strokeWidth={1.25}
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium text-heading">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 rounded-lg bg-primary-muted px-2.5 py-1 text-sm font-medium text-heading">
                          {formatPriceTHB(service.price)}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                          <Clock className="h-4 w-4" strokeWidth={1.5} />
                          {service.durationMinutes} นาที
                        </span>

                        <Link
                          href={`/${shopSlug}/book/${service.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition group-hover:bg-primary-hover"
                        >
                          จองคิว
                        </Link>
                      </div>

                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-primary-muted">
                        <div className="h-full w-2/3 rounded-full bg-muted/60" />
                      </div>
                    </div>
                  </article>
                </MotionPress>
              </StaggerItem>
            ))}
          </StaggerList>
        )}

        <BlurFade delay={0.3} duration={0.5} className="mt-10 text-center">
          <p className="text-xs text-muted">
            Powered by{" "}
            <Link href="/" className="font-medium text-foreground hover:text-heading hover:underline">
              BookFlow
            </Link>
          </p>
        </BlurFade>
      </div>
    </div>
  );
}

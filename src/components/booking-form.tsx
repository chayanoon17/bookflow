"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, addDays, startOfToday } from "date-fns";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn, formatPriceTHB } from "@/lib/utils";
import {
  isShopOpenOnDate,
  parseWorkingHours,
} from "@/lib/slots";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { slideStep, spring } from "@/lib/motion";
import { FadeIn } from "@/components/motion";

interface Slot {
  start: string;
  end: string;
  label: string;
}

interface ServiceInfo {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
}

interface Props {
  params: { shopSlug: string; serviceId: string };
  merchant: {
    shopName: string;
    workingHours: unknown;
    holidays: { date: string }[];
  };
  service: ServiceInfo;
}

export function BookingForm({
  params: { shopSlug, serviceId },
  merchant,
  service,
}: Props) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const today = startOfToday();
  const [step, setStep] = useState<"date" | "time" | "info">("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerSocial: "",
    customerNotes: "",
  });

  const workingHours = parseWorkingHours(merchant.workingHours);
  const holidays = merchant.holidays.map((h) => ({
    date: new Date(h.date),
  }));

  const dates = Array.from({ length: 30 }, (_, i) => {
    const d = addDays(today, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const open = isShopOpenOnDate(dateStr, workingHours, holidays);
    return { dateStr, label: format(d, "EEE d MMM"), open };
  });

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(
      `/api/slots?slug=${shopSlug}&serviceId=${serviceId}&date=${selectedDate}`
    )
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setLoadingSlots(false);
      });
  }, [selectedDate, shopSlug, serviceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: shopSlug,
        serviceId,
        ...form,
        startTime: selectedSlot.start,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }

    router.push(
      `/${shopSlug}/success?ref=${data.appointment.referenceCode}`
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href={`/${shopSlug}`}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm text-gray-500">{merchant.shopName}</p>
            <p className="font-semibold">{service.name}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <FadeIn>
          <div className="mb-6 flex gap-2">
            {(["date", "time", "info"] as const).map((s, i) => (
              <motion.div
                key={s}
                className="h-1 flex-1 rounded-full bg-gray-200"
                animate={{
                  backgroundColor:
                    (s === "date" && (step === "date" || step === "time" || step === "info")) ||
                    (s === "time" && (step === "time" || step === "info")) ||
                    (s === "info" && step === "info")
                      ? "#4f46e5"
                      : "#e5e7eb",
                  scaleY:
                    (s === "date" && step === "date") ||
                    (s === "time" && step === "time") ||
                    (s === "info" && step === "info")
                      ? 1.4
                      : 1,
                }}
                transition={{ ...spring, delay: i * 0.05 }}
              />
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {step === "date" && (
            <motion.div
              key="date"
              initial={reduced ? false : slideStep.initial}
              animate={slideStep.animate}
              exit={reduced ? undefined : slideStep.exit}
              transition={spring}
            >
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Calendar className="h-5 w-5 text-indigo-600" />
              เลือกวัน
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {dates.map((d) => (
                <button
                  key={d.dateStr}
                  disabled={!d.open}
                  onClick={() => {
                    setSelectedDate(d.dateStr);
                    setStep("time");
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-center text-sm transition",
                    d.open
                      ? "border-gray-200 bg-white hover:border-indigo-300 active:scale-95"
                      : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
            </motion.div>
          )}

          {step === "time" && (
            <motion.div
              key="time"
              initial={reduced ? false : slideStep.initial}
              animate={slideStep.animate}
              exit={reduced ? undefined : slideStep.exit}
              transition={spring}
            >
            <button
              onClick={() => setStep("date")}
              className="mb-4 text-sm text-indigo-600"
            >
              ← เปลี่ยนวัน ({selectedDate})
            </button>
            <h2 className="mb-4 font-semibold">เลือกเวลา</h2>
            {loadingSlots ? (
              <p className="py-8 text-center text-gray-500">กำลังโหลด...</p>
            ) : slots.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                ไม่มีช่วงเวลาว่างในวันนี้
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("info");
                    }}
                    className="rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium transition hover:border-indigo-300 active:scale-95"
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
            </motion.div>
          )}

          {step === "info" && selectedSlot && (
            <motion.div
              key="info"
              initial={reduced ? false : slideStep.initial}
              animate={slideStep.animate}
              exit={reduced ? undefined : slideStep.exit}
              transition={spring}
            >
          <Card>
            <button
              onClick={() => setStep("time")}
              className="mb-4 text-sm text-indigo-600"
            >
              ← เปลี่ยนเวลา ({selectedSlot.label})
            </button>
            <p className="mb-4 text-sm text-gray-500">
              {service.name} · {formatPriceTHB(service.price)} ·{" "}
              {service.durationMinutes} นาที
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="name"
                label="ชื่อ-นามสกุล"
                value={form.customerName}
                onChange={(e) =>
                  setForm({ ...form, customerName: e.target.value })
                }
                required
              />
              <Input
                id="phone"
                label="เบอร์โทรศัพท์"
                type="tel"
                value={form.customerPhone}
                onChange={(e) =>
                  setForm({ ...form, customerPhone: e.target.value })
                }
                required
                minLength={9}
              />
              <Input
                id="social"
                label="โซเชียลมีเดีย (ไม่บังคับ)"
                placeholder="@username"
                value={form.customerSocial}
                onChange={(e) =>
                  setForm({ ...form, customerSocial: e.target.value })
                }
              />
              <Input
                id="notes"
                label="หมายเหตุ (ไม่บังคับ)"
                value={form.customerNotes}
                onChange={(e) =>
                  setForm({ ...form, customerNotes: e.target.value })
                }
              />
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={submitting}
              >
                ยืนยันการจอง
              </Button>
            </form>
          </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

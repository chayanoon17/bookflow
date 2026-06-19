"use client";

import Link from "next/link";
import { Calendar, Clock, Scissors, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { StaggerItem, StaggerList } from "@/components/motion";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Smartphone,
    title: "จองผ่านมือถือ",
    desc: "ลูกค้าจองคิวเองได้จากลิงก์ ไม่ต้องทักแชทถามเวลาว่างทุกครั้ง",
    pastel: "bg-pastel-pink" as const,
    progress: 72,
  },
  {
    icon: Clock,
    title: "คำนวณคิวอัตโนมัติ",
    desc: "ระบบคำนวณเวลาว่างตามระยะเวลาบริการ ป้องกันคิวซ้ำ",
    pastel: "bg-pastel-mint" as const,
    progress: 58,
  },
  {
    icon: Scissors,
    title: "เริ่มใช้งานเร็ว",
    desc: "สมัครแล้วตั้งร้านได้เลย ไม่ต้องติดตั้งระบบซับซ้อน",
    pastel: "bg-pastel-blue" as const,
    progress: 90,
  },
];

export function HomePageContent() {
  return (
    <div className="min-h-screen bg-background">
      <BlurFade delay={0} duration={0.5}>
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-heading" strokeWidth={1.5} />
              <span className="text-lg font-semibold tracking-tight text-heading">
                BookFlow
              </span>
            </div>
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button>เริ่มใช้งานฟรี</Button>
              </Link>
            </div>
          </div>
        </header>
      </BlurFade>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
          <BlurFade delay={0.1} duration={0.5}>
            <p className="mb-4 text-sm font-medium text-muted">
              ระบบจองคิวสำหรับร้าน SME ขนาดเล็ก
            </p>
          </BlurFade>

          <BlurFade delay={0.15} duration={0.55} blur="8px">
            <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-heading sm:text-5xl">
              จองคิวออนไลน์
              <br />
              <span className="mt-2 inline-block text-2xl font-medium text-foreground sm:text-3xl">
                สำหรับร้าน SME ขนาดเล็ก
              </span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.35} duration={0.5} blur="6px">
            <p className="mx-auto mt-6 max-w-lg text-base text-muted sm:text-lg">
              แชร์ลิงก์จองให้ลูกค้า จัดการตารางคิวในที่เดียว
              เหมาะกับร้านทำเล็บ ตัดผม คลินิกความงาม และร้านบริการอื่น ๆ
            </p>
          </BlurFade>

          <BlurFade delay={0.5} duration={0.5}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link href="/register">
                <Button size="lg">สร้างร้านของคุณ</Button>
              </Link>
              <p className="text-sm text-muted">
                ลิงก์จอง: bookflow.app/
                <strong className="font-medium text-heading">your-shop</strong>
              </p>
            </div>
          </BlurFade>
        </section>

        <section className="border-t border-border bg-surface py-16">
          <BlurFade delay={0.1} inView>
            <p className="mb-10 text-center text-sm text-muted">
              ร่างระบบจองของคุณ — บริการ · เวลา · ลูกค้า
            </p>
          </BlurFade>

          <StaggerList className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <StaggerItem key={feature.title}>
                <BlurFade delay={0.1 + i * 0.08} inView blur="6px">
                  <PastelFeatureCard {...feature} />
                </BlurFade>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>
      </main>
    </div>
  );
}

function PastelFeatureCard({
  icon: Icon,
  title,
  desc,
  pastel,
  progress,
}: (typeof FEATURES)[number]) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:shadow-md">
      <div
        className={cn(
          "flex h-36 items-center justify-center border-b border-border/50",
          pastel
        )}
      >
        <Icon className="h-16 w-16 text-heading/45" strokeWidth={1.25} />
      </div>
      <div className="p-4 text-left">
        <h3 className="font-medium text-heading">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-primary-muted">
          <div
            className="h-full rounded-full bg-heading/25 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

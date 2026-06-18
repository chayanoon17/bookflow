"use client";

import Link from "next/link";
import { Calendar, Clock, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion";

export function HomePageContent() {
  return (
    <div className="min-h-screen">
      <FadeIn>
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">BookFlow</span>
            </div>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost">เข้าสู่ระบบ</Button>
              </Link>
              <Link href="/register">
                <Button>เริ่มใช้งานฟรี</Button>
              </Link>
            </div>
          </div>
        </header>
      </FadeIn>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              จองคิวออนไลน์
              <br />
              <span className="text-indigo-600">สำหรับร้าน Social Media</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              วางลิงก์บน TikTok Bio ให้ลูกค้าจองคิวได้ทันที
              จัดการตารางคิว แจ้งเตือน LINE และรองรับ AI Chatbot
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg">สร้างร้านของคุณ</Button>
              </Link>
              <p className="text-sm text-gray-500">
                ลิงก์จอง: bookflow.app/<strong>your-shop</strong>
              </p>
            </div>
          </FadeIn>
        </section>

        <section className="border-t border-gray-200 bg-white py-16">
          <StaggerList className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            <StaggerItem>
              <Feature
                icon={<Smartphone className="h-6 w-6 text-indigo-600" />}
                title="Mobile-First"
                desc="ลูกค้าจองผ่านมือถือได้ง่าย ด้วย UI ออกแบบมาสำหรับ TikTok"
              />
            </StaggerItem>
            <StaggerItem>
              <Feature
                icon={<Clock className="h-6 w-6 text-indigo-600" />}
                title="คำนวณคิวอัตโนมัติ"
                desc="ระบบคำนวณเวลาว่างตามระยะเวลาบริการ ป้องกันคิวซ้ำ"
              />
            </StaggerItem>
            <StaggerItem>
              <Feature
                icon={<Zap className="h-6 w-6 text-indigo-600" />}
                title="AI Chatbot"
                desc="รับจองผ่าน LINE OA ด้วย AI ที่ดึงคิวว่างแบบ Real-time"
              />
            </StaggerItem>
          </StaggerList>
        </section>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

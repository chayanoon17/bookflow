"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPriceTHB } from "@/lib/utils";
import { formatDateTH, formatTimeTH } from "@/lib/slots";
import { FadeIn, motion } from "@/components/motion";
import { useReducedMotion } from "motion/react";
import { scaleIn, spring } from "@/lib/motion";

interface Appointment {
  referenceCode: string;
  customerName: string;
  startTime: string;
  service: { name: string; price: number };
  merchant: { shopName: string; slug: string };
}

function SuccessContent({ shopSlug }: { shopSlug: string }) {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const reduced = useReducedMotion();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }
    fetch(`/api/appointments?slug=${shopSlug}&ref=${ref}`)
      .then((r) => r.json())
      .then((data) => {
        setAppointment(data.appointment ?? null);
        setLoading(false);
      });
  }, [ref, shopSlug]);

  if (loading) {
    return <p className="py-16 text-center text-gray-500">กำลังโหลด...</p>;
  }

  if (!appointment) {
    return (
      <Card className="text-center">
        <p className="py-8 text-gray-500">ไม่พบข้อมูลการจอง</p>
        <Link href={`/${shopSlug}`}>
          <Button>กลับหน้าร้าน</Button>
        </Link>
      </Card>
    );
  }

  return (
    <FadeIn className="text-center">
      <motion.div
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={scaleIn}
        transition={{ ...spring, delay: 0.1 }}
      >
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      </motion.div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">จองสำเร็จ!</h1>
      <p className="mt-2 text-gray-500">
        ร้านจะยืนยันการจองของคุณเร็วๆ นี้
      </p>

      <Card className="mt-6 text-left">
        <div className="space-y-3">
          <Row
            icon={<Hash className="h-4 w-4" />}
            label="รหัสอ้างอิง"
            value={appointment.referenceCode}
            highlight
          />
          <Row
            icon={<Calendar className="h-4 w-4" />}
            label="วันที่"
            value={formatDateTH(new Date(appointment.startTime))}
          />
          <Row
            icon={<Clock className="h-4 w-4" />}
            label="เวลา"
            value={formatTimeTH(new Date(appointment.startTime))}
          />
          <Row label="บริการ" value={appointment.service.name} />
          <Row
            label="ราคา"
            value={formatPriceTHB(appointment.service.price)}
          />
          <Row label="ชื่อ" value={appointment.customerName} />
        </div>
      </Card>

      <Link href={`/${shopSlug}`} className="mt-6 block">
        <Button variant="outline" className="w-full">
          กลับหน้าร้าน
        </Button>
      </Link>
    </FadeIn>
  );
}

function Row({
  icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        {label}
      </span>
      <span
        className={
          highlight ? "font-mono font-bold text-indigo-600" : "font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ shopSlug: string }>;
}) {
  const { shopSlug } = await params;
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Suspense fallback={<p className="text-center">กำลังโหลด...</p>}>
          <SuccessContent shopSlug={shopSlug} />
        </Suspense>
      </div>
    </div>
  );
}

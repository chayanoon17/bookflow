import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateAvailableSlots,
  parseWorkingHours,
  BLOCKING_STATUSES,
  formatDateTH,
  formatTimeTH,
} from "@/lib/slots";
import { createAppointment } from "@/lib/appointments";
import { addDays, format } from "date-fns";

/**
 * Phase 3: LINE OA webhook stub.
 * Parses simple booking intents and returns available slots.
 * Full AI integration can replace detectIntent() with an LLM call.
 */
function detectIntent(text: string): "book" | "slots" | "unknown" {
  const lower = text.toLowerCase();
  if (
    lower.includes("จอง") ||
    lower.includes("book") ||
    lower.includes("นัด")
  ) {
    return "book";
  }
  if (lower.includes("ว่าง") || lower.includes("slot") || lower.includes("เวลา")) {
    return "slots";
  }
  return "unknown";
}

export async function POST(request: Request) {
  const body = await request.json();
  const events = body.events ?? [];

  const shopSlug = request.headers.get("x-shop-slug") ?? "demo";
  const merchant = await prisma.merchant.findUnique({
    where: { slug: shopSlug },
    include: { services: { where: { isActive: true } }, holidays: true },
  });

  if (!merchant) {
    return NextResponse.json({ error: "Shop not configured" }, { status: 404 });
  }

  const replies: string[] = [];

  for (const event of events) {
    if (event.type !== "message" || event.message?.type !== "text") continue;

    const text = event.message.text as string;
    const intent = detectIntent(text);

    if (intent === "unknown") {
      replies.push(
        `สวัสดีค่ะ ยินดีต้อนรับสู่ ${merchant.shopName}!\nพิมพ์ "จองคิว" หรือ "ดูเวลาว่าง" เพื่อเริ่มจองนะคะ`
      );
      continue;
    }

    const defaultService = merchant.services[0];
    if (!defaultService) {
      replies.push("ขออภัยค่ะ ร้านยังไม่มีบริการที่เปิดจอง");
      continue;
    }

    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const workingHours = parseWorkingHours(merchant.workingHours);

    const existing = await prisma.appointment.findMany({
      where: {
        merchantId: merchant.id,
        status: { in: BLOCKING_STATUSES },
      },
      select: { startTime: true, endTime: true },
    });

    const slots = calculateAvailableSlots({
      dateStr: tomorrow,
      durationMinutes: defaultService.durationMinutes,
      workingHours,
      holidays: merchant.holidays,
      existingAppointments: existing,
    }).slice(0, 5);

    if (slots.length === 0) {
      replies.push("ขออภัยค่ะ ไม่มีช่วงเวลาว่างในวันพรุ่งนี้ ลองเลือกวันอื่นได้ที่ลิงก์จองค่ะ");
      continue;
    }

    const slotList = slots
      .map((s, i) => `${i + 1}. ${s.label}`)
      .join("\n");

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    replies.push(
      `📅 เวลาว่าง ${formatDateTH(slots[0].start)} (${defaultService.name}):\n${slotList}\n\nจองออนไลน์: ${baseUrl}/${merchant.slug}`
    );

    if (intent === "book" && slots[0]) {
      try {
        const appointment = await createAppointment({
          merchantId: merchant.id,
          serviceId: defaultService.id,
          customerName: "LINE Customer",
          customerPhone: "0000000000",
          startTime: slots[0].start,
          durationMinutes: defaultService.durationMinutes,
          source: "LINE_AI",
        });

        replies.push(
          `✅ สร้างคิวชั่วคราวแล้ว (${formatTimeTH(appointment.startTime)})\nรหัส: ${appointment.referenceCode}\nยืนยันข้อมูล: ${baseUrl}/${merchant.slug}/success?ref=${appointment.referenceCode}`
        );
      } catch {
        replies.push("ขออภัยค่ะ ช่วงเวลานี้เพิ่งถูกจองไป กรุณาเลือกเวลาอื่น");
      }
    }
  }

  return NextResponse.json({ replies });
}

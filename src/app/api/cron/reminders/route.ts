import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subHours, addHours } from "date-fns";
import { sendCustomerReminder } from "@/lib/notifications";
import { formatDateTH, formatTimeTH } from "@/lib/slots";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = subHours(now, 1);
  const windowEnd = addHours(now, 24);

  const appointments = await prisma.appointment.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      reminderSentAt: null,
      startTime: { gte: windowStart, lte: windowEnd },
    },
    include: { merchant: true, service: true },
  });

  const toRemind = appointments.filter((apt) => {
    const hoursUntil =
      (apt.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil <= 24 && hoursUntil >= 23;
  });

  const results = [];
  for (const apt of toRemind) {
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const result = await sendCustomerReminder({
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      shopName: apt.merchant.shopName,
      startTime: `${formatDateTH(apt.startTime)} ${formatTimeTH(apt.startTime)}`,
      referenceCode: apt.referenceCode,
      confirmUrl: `${baseUrl}/${apt.merchant.slug}/success?ref=${apt.referenceCode}`,
    });

    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSentAt: new Date() },
    });

    results.push({ id: apt.id, ...result });
  }

  return NextResponse.json({ processed: results.length, results });
}

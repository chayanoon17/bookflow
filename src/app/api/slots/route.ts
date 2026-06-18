import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateAvailableSlots,
  parseWorkingHours,
  BLOCKING_STATUSES,
} from "@/lib/slots";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!slug || !serviceId || !date) {
    return NextResponse.json(
      { error: "slug, serviceId, and date are required" },
      { status: 400 }
    );
  }

  const merchant = await prisma.merchant.findUnique({
    where: { slug },
    include: { holidays: true },
  });

  if (!merchant) {
    return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, merchantId: merchant.id, isActive: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const dayStart = startOfDay(parseISO(`${date}T00:00:00`));
  const dayEnd = endOfDay(parseISO(`${date}T00:00:00`));

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      merchantId: merchant.id,
      status: { in: BLOCKING_STATUSES },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  const workingHours = parseWorkingHours(merchant.workingHours);
  const slots = calculateAvailableSlots({
    dateStr: date,
    durationMinutes: service.durationMinutes,
    workingHours,
    holidays: merchant.holidays,
    existingAppointments,
  });

  return NextResponse.json({
    slots: slots.map((s) => ({
      start: s.start.toISOString(),
      end: s.end.toISOString(),
      label: s.label,
    })),
  });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createAppointment,
  SlotConflictError,
  updateAppointmentStatus,
} from "@/lib/appointments";
import { notifyMerchantNewBooking } from "@/lib/notifications";
import { formatDateTH, formatTimeTH } from "@/lib/slots";
import { auth } from "@/lib/auth";
import { APPOINTMENT_STATUSES } from "@/types";

const createSchema = z.object({
  slug: z.string(),
  serviceId: z.string(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(9),
  customerSocial: z.string().optional(),
  customerNotes: z.string().optional(),
  startTime: z.string().datetime(),
  source: z.enum(["WEB", "LINE_AI", "MANUAL"]).optional(),
});

const updateSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
});

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const date = searchParams.get("date");
  const month = searchParams.get("month");

  if (session?.user?.id) {
    const where: Record<string, unknown> = { merchantId: session.user.id };

    if (date) {
      const dayStart = new Date(`${date}T00:00:00.000Z`);
      const dayEnd = new Date(`${date}T23:59:59.999Z`);
      where.startTime = { gte: dayStart, lte: dayEnd };
    } else if (month) {
      const [year, m] = month.split("-").map(Number);
      const monthStart = new Date(Date.UTC(year, m - 1, 1));
      const monthEnd = new Date(Date.UTC(year, m, 0, 23, 59, 59, 999));
      where.startTime = { gte: monthStart, lte: monthEnd };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { service: true },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ appointments });
  }

  if (slug) {
    const ref = searchParams.get("ref");
    const merchant = await prisma.merchant.findUnique({ where: { slug } });
    if (!merchant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (ref) {
      const appointment = await prisma.appointment.findFirst({
        where: { referenceCode: ref, merchantId: merchant.id },
        include: { service: true, merchant: true },
      });
      return NextResponse.json({ appointment });
    }
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const merchant = await prisma.merchant.findUnique({
      where: { slug: data.slug },
    });
    if (!merchant) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const service = await prisma.service.findFirst({
      where: {
        id: data.serviceId,
        merchantId: merchant.id,
        isActive: true,
      },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const appointment = await createAppointment({
      merchantId: merchant.id,
      serviceId: service.id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerSocial: data.customerSocial,
      customerNotes: data.customerNotes,
      startTime: new Date(data.startTime),
      durationMinutes: service.durationMinutes,
      source: data.source,
    });

    await notifyMerchantNewBooking({
      shopName: merchant.shopName,
      customerName: data.customerName,
      serviceName: service.name,
      startTime: `${formatDateTH(appointment.startTime)} ${formatTimeTH(appointment.startTime)}`,
      referenceCode: appointment.referenceCode,
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof SlotConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    console.error("Create appointment error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    if (!APPOINTMENT_STATUSES.includes(data.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await updateAppointmentStatus(
      id,
      session.user.id,
      data.status
    );

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

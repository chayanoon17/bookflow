import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const settingsSchema = z.object({
  shopName: z.string().min(2).optional(),
  phone: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  workingHours: z.record(z.string(), z.unknown()).optional(),
});

const holidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findUnique({
    where: { id: session.user.id },
    include: {
      holidays: { orderBy: { date: "asc" } },
    },
  });

  if (!merchant) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { passwordHash: _, ...safe } = merchant;
  return NextResponse.json({ merchant: safe });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = settingsSchema.parse(body);

    const merchant = await prisma.merchant.update({
      where: { id: session.user.id },
      data: {
        shopName: data.shopName,
        phone: data.phone,
        logoUrl: data.logoUrl || null,
        workingHours: data.workingHours as unknown as Prisma.InputJsonValue | undefined,
      },
    });

    const { passwordHash: _, ...safe } = merchant;
    return NextResponse.json({ merchant: safe });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = holidaySchema.parse(body);

    const holiday = await prisma.holidayOff.create({
      data: {
        merchantId: session.user.id,
        date: new Date(`${data.date}T00:00:00.000Z`),
        reason: data.reason,
      },
    });

    return NextResponse.json({ holiday }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const holidayId = searchParams.get("holidayId");

  if (!holidayId) {
    return NextResponse.json({ error: "holidayId required" }, { status: 400 });
  }

  await prisma.holidayOff.deleteMany({
    where: { id: holidayId, merchantId: session.user.id },
  });

  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { DEFAULT_WORKING_HOURS } from "@/types";
import type { Prisma } from "@prisma/client";

const registerSchema = z.object({
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  shopName: z.string().min(2, "ชื่อร้านต้องมีอย่างน้อย 2 ตัวอักษร"),
  slug: z
    .string()
    .min(3, "Slug ต้องมีอย่างน้อย 3 ตัวอักษร")
    .regex(/^[a-z0-9-]+$/, "Slug ใช้ได้เฉพาะ a-z, 0-9 และ -"),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registerSchema.parse(body);

    const existingEmail = await prisma.merchant.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    const slug = data.slug || slugify(data.shopName);
    const existingSlug = await prisma.merchant.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json(
        { error: "Slug นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const merchant = await prisma.merchant.create({
      data: {
        email: data.email,
        passwordHash,
        shopName: data.shopName,
        slug,
        phone: data.phone,
        workingHours: DEFAULT_WORKING_HOURS as unknown as Prisma.InputJsonValue,
      },
      select: { id: true, email: true, shopName: true, slug: true },
    });

    return NextResponse.json({ merchant }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { generateReferenceCode } from "@/lib/utils";
import { BLOCKING_STATUSES } from "@/types";
import { addMinutes } from "date-fns";

export class SlotConflictError extends Error {
  constructor(message = "ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น") {
    super(message);
    this.name = "SlotConflictError";
  }
}

export async function createAppointment(params: {
  merchantId: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerSocial?: string;
  customerNotes?: string;
  startTime: Date;
  durationMinutes: number;
  source?: string;
}) {
  const endTime = addMinutes(params.startTime, params.durationMinutes);

  const conflict = await prisma.appointment.findFirst({
    where: {
      merchantId: params.merchantId,
      status: { in: BLOCKING_STATUSES },
      startTime: { lt: endTime },
      endTime: { gt: params.startTime },
    },
  });

  if (conflict) {
    throw new SlotConflictError();
  }

  let referenceCode = generateReferenceCode();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.appointment.findUnique({
      where: { referenceCode },
    });
    if (!existing) break;
    referenceCode = generateReferenceCode();
    attempts++;
  }

  return prisma.appointment.create({
    data: {
      referenceCode,
      merchantId: params.merchantId,
      serviceId: params.serviceId,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerSocial: params.customerSocial,
      customerNotes: params.customerNotes,
      startTime: params.startTime,
      endTime,
      source: params.source ?? "WEB",
      status: "PENDING",
    },
    include: { service: true, merchant: true },
  });
}

export async function updateAppointmentStatus(
  appointmentId: string,
  merchantId: string,
  status: string
) {
  return prisma.appointment.updateMany({
    where: { id: appointmentId, merchantId },
    data: { status },
  });
}

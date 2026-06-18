import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking-form";

interface Props {
  params: Promise<{ shopSlug: string; serviceId: string }>;
}

export default async function BookPage({ params }: Props) {
  const { shopSlug, serviceId } = await params;

  const merchant = await prisma.merchant.findUnique({
    where: { slug: shopSlug },
    include: { holidays: true },
  });

  if (!merchant) notFound();

  const service = await prisma.service.findFirst({
    where: { id: serviceId, merchantId: merchant.id, isActive: true },
  });

  if (!service) notFound();

  return (
    <BookingForm
      params={{ shopSlug, serviceId }}
      merchant={{
        shopName: merchant.shopName,
        workingHours: merchant.workingHours,
        holidays: merchant.holidays.map((h) => ({
          date: h.date.toISOString(),
        })),
      }}
      service={{
        id: service.id,
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes,
      }}
    />
  );
}

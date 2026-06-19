import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShopPageContent } from "@/components/shop-page-content";

interface Props {
  params: Promise<{ shopSlug: string }>;
}

export default async function ShopPage({ params }: Props) {
  const { shopSlug } = await params;

  const merchant = await prisma.merchant.findUnique({
    where: { slug: shopSlug },
    include: {
      services: { where: { isActive: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!merchant) notFound();

  return (
    <ShopPageContent
      shopSlug={shopSlug}
      shopName={merchant.shopName}
      phone={merchant.phone}
      logoUrl={merchant.logoUrl}
      workingHours={merchant.workingHours}
      services={merchant.services}
    />
  );
}

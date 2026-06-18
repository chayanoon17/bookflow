"use client";

import Link from "next/link";
import { Clock, Phone, ChevronRight } from "lucide-react";
import { formatPriceTHB } from "@/lib/utils";
import { FadeIn, MotionPress, StaggerItem, StaggerList } from "@/components/motion";
import { motion, useReducedMotion } from "motion/react";
import { scaleIn, spring } from "@/lib/motion";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}

interface Props {
  shopSlug: string;
  shopName: string;
  phone: string | null;
  logoUrl: string | null;
  services: Service[];
}

export function ShopPageContent({
  shopSlug,
  shopName,
  phone,
  logoUrl,
  services,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <FadeIn className="mx-auto max-w-lg px-4 py-6 text-center">
          {logoUrl ? (
            <motion.img
              src={logoUrl}
              alt={shopName}
              className="mx-auto h-16 w-16 rounded-2xl object-cover"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={scaleIn}
              transition={spring}
            />
          ) : (
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-600"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={scaleIn}
              transition={spring}
            >
              {shopName.charAt(0)}
            </motion.div>
          )}
          <h1 className="mt-3 text-xl font-bold text-gray-900">{shopName}</h1>
          {phone && (
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-gray-500">
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </p>
          )}
        </FadeIn>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <FadeIn delay={0.1}>
          <h2 className="mb-4 text-sm font-medium text-gray-500">เลือกบริการ</h2>
        </FadeIn>

        {services.length === 0 ? (
          <FadeIn delay={0.15}>
            <p className="rounded-2xl bg-white p-8 text-center text-gray-500">
              ร้านยังไม่มีบริการที่เปิดจอง
            </p>
          </FadeIn>
        ) : (
          <StaggerList className="space-y-3">
            {services.map((service) => (
              <StaggerItem key={service.id}>
                <MotionPress>
                  <Link
                    href={`/${shopSlug}/book/${service.id}`}
                    className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      {service.description && (
                        <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">
                          {service.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <span className="font-medium text-indigo-600">
                          {formatPriceTHB(service.price)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          {service.durationMinutes} นาที
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
                  </Link>
                </MotionPress>
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </main>
    </div>
  );
}

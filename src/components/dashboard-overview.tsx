"use client";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatPriceTHB } from "@/lib/utils";
import { formatTimeTH } from "@/lib/slots";
import { FadeIn, StaggerItem, StaggerList } from "@/components/motion";
import { CalendarCheck, Users, Banknote } from "lucide-react";
import type { AppointmentStatus } from "@/types";

interface Appointment {
  id: string;
  customerName: string;
  startTime: Date;
  status: string;
  service: { name: string; price: number };
}

interface Props {
  dateLabel: string;
  appointments: Appointment[];
  revenue: number;
  uniqueCustomers: number;
}

export function DashboardOverview({
  dateLabel,
  appointments,
  revenue,
  uniqueCustomers,
}: Props) {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ภาพรวมวันนี้</h1>
          <p className="text-gray-500">{dateLabel}</p>
        </div>
      </FadeIn>

      <StaggerList className="grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <StatCard
            icon={<CalendarCheck className="h-5 w-5 text-indigo-600" />}
            label="คิววันนี้"
            value={String(appointments.length)}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Users className="h-5 w-5 text-teal-600" />}
            label="ลูกค้า"
            value={String(uniqueCustomers)}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Banknote className="h-5 w-5 text-amber-600" />}
            label="รายได้ประเมิน"
            value={formatPriceTHB(revenue)}
          />
        </StaggerItem>
      </StaggerList>

      <FadeIn delay={0.2}>
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900">คิววันนี้</h2>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-gray-500">ยังไม่มีคิววันนี้</p>
          ) : (
            <StaggerList className="space-y-3">
              {appointments.map((apt) => (
                <StaggerItem key={apt.id}>
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                    <div>
                      <p className="font-medium">{apt.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {apt.service.name} · {formatTimeTH(apt.startTime)}
                      </p>
                    </div>
                    <StatusBadge status={apt.status as AppointmentStatus} />
                  </div>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-xl bg-gray-50 p-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}

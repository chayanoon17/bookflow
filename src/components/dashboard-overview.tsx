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
          <h1 className="text-2xl font-semibold text-heading">ภาพรวมวันนี้</h1>
          <p className="text-muted">{dateLabel}</p>
        </div>
      </FadeIn>

      <StaggerList className="grid gap-4 sm:grid-cols-3">
        <StaggerItem>
          <StatCard
            icon={<CalendarCheck className="h-5 w-5 text-heading/60" strokeWidth={1.5} />}
            label="คิววันนี้"
            value={String(appointments.length)}
            pastel="bg-pastel-pink"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Users className="h-5 w-5 text-heading/60" strokeWidth={1.5} />}
            label="ลูกค้า"
            value={String(uniqueCustomers)}
            pastel="bg-pastel-mint"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={<Banknote className="h-5 w-5 text-heading/60" strokeWidth={1.5} />}
            label="รายได้ประเมิน"
            value={formatPriceTHB(revenue)}
            pastel="bg-pastel-blue"
          />
        </StaggerItem>
      </StaggerList>

      <FadeIn delay={0.2}>
        <Card>
          <h2 className="mb-4 font-medium text-heading">คิววันนี้</h2>
          {appointments.length === 0 ? (
            <p className="py-8 text-center text-muted">ยังไม่มีคิววันนี้</p>
          ) : (
            <StaggerList className="space-y-3">
              {appointments.map((apt) => (
                <StaggerItem key={apt.id}>
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="font-medium text-heading">{apt.customerName}</p>
                      <p className="text-sm text-muted">
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
  pastel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pastel: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className={`flex items-center gap-4 p-4 ${pastel} border-b border-border/50`}>
        <div className="rounded-xl bg-surface/80 p-2.5">{icon}</div>
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-semibold text-heading">{value}</p>
        </div>
      </div>
    </Card>
  );
}

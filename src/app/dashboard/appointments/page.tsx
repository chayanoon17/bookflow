"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatPriceTHB, formatPhone } from "@/lib/utils";
import { formatTimeTH } from "@/lib/slots";
import { APPOINTMENT_STATUSES, STATUS_LABELS, type AppointmentStatus } from "@/types";
import { List, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone: string;
  startTime: string;
  status: string;
  service: { name: string; price: number };
}

export default function AppointmentsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = view === "list" ? `date=${date}` : `month=${date.slice(0, 7)}`;
      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      setAppointments(data.appointments ?? []);
      setLoading(false);
    }
    load();
  }, [date, view]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    await fetch(`/api/appointments?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">ตารางคิว</h1>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" /> รายวัน
          </Button>
          <Button
            variant={view === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <Calendar className="h-4 w-4" /> รายเดือน
          </Button>
          <input
            type={view === "list" ? "date" : "month"}
            value={view === "list" ? date : date.slice(0, 7)}
            onChange={(e) => {
              const v = e.target.value;
              setDate(view === "list" ? v : `${v}-01`);
            }}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <p className="py-8 text-center text-gray-500">กำลังโหลด...</p>
        ) : appointments.length === 0 ? (
          <p className="py-8 text-center text-gray-500">ไม่มีคิวในช่วงเวลานี้</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{apt.customerName}</p>
                      <StatusBadge status={apt.status as AppointmentStatus} />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatPhone(apt.customerPhone)} · {apt.service.name} ·{" "}
                      {formatPriceTHB(apt.service.price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(apt.startTime), "d MMM yyyy")}{" "}
                      {formatTimeTH(new Date(apt.startTime))} · {apt.referenceCode}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {APPOINTMENT_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(apt.id, s)}
                        className={cn(
                          "rounded-lg px-2 py-1 text-xs transition",
                          apt.status === s
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        )}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

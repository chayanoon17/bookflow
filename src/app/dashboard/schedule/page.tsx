"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DAY_KEYS,
  DAY_LABELS,
  DEFAULT_WORKING_HOURS,
  type DayKey,
  type WorkingHours,
} from "@/types";
import { Trash2 } from "lucide-react";

interface Holiday {
  id: string;
  date: string;
  reason: string | null;
}

export default function SchedulePage() {
  const [workingHours, setWorkingHours] =
    useState<WorkingHours>(DEFAULT_WORKING_HOURS);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.merchant?.workingHours) {
          setWorkingHours({
            ...DEFAULT_WORKING_HOURS,
            ...data.merchant.workingHours,
          });
        }
        setHolidays(
          (data.merchant?.holidays ?? []).map(
            (h: { id: string; date: string; reason: string | null }) => ({
              ...h,
              date: h.date.slice(0, 10),
            })
          )
        );
      });
  }, []);

  function updateDay(day: DayKey, field: string, value: string | boolean) {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function saveSchedule() {
    setSaving(true);
    await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workingHours }),
    });
    setSaving(false);
  }

  async function addHoliday() {
    if (!holidayDate) return;
    const res = await fetch("/api/merchant/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: holidayDate, reason: holidayReason }),
    });
    const data = await res.json();
    if (data.holiday) {
      setHolidays((prev) => [
        ...prev,
        { ...data.holiday, date: holidayDate },
      ]);
      setHolidayDate("");
      setHolidayReason("");
    }
  }

  async function removeHoliday(id: string) {
    await fetch(`/api/merchant/settings?holidayId=${id}`, {
      method: "DELETE",
    });
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-heading">เวลาทำการ</h1>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-pastel-mint px-5 py-4">
          <h2 className="font-medium text-heading">เวลาเปิด-ปิดรายสัปดาห์</h2>
        </div>
        <div className="space-y-3 p-5">
          {DAY_KEYS.map((day) => (
            <div
              key={day}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3"
            >
              <label className="flex w-24 items-center gap-2">
                <input
                  type="checkbox"
                  checked={workingHours[day].open}
                  onChange={(e) => updateDay(day, "open", e.target.checked)}
                  className="rounded border-border text-heading focus:ring-heading/20"
                />
                <span className="text-sm font-medium text-heading">
                  {DAY_LABELS[day]}
                </span>
              </label>
              {workingHours[day].open && (
                <>
                  <input
                    type="time"
                    value={workingHours[day].start ?? "09:00"}
                    onChange={(e) => updateDay(day, "start", e.target.value)}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-heading outline-none focus:border-heading focus:ring-2 focus:ring-heading/10"
                  />
                  <span className="text-muted">ถึง</span>
                  <input
                    type="time"
                    value={workingHours[day].end ?? "18:00"}
                    onChange={(e) => updateDay(day, "end", e.target.value)}
                    className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-heading outline-none focus:border-heading focus:ring-2 focus:ring-heading/10"
                  />
                </>
              )}
              {!workingHours[day].open && (
                <span className="text-sm text-muted">ปิดทำการ</span>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border px-5 pb-5">
          <Button onClick={saveSchedule} loading={saving}>
            บันทึกเวลาทำการ
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-pastel-pink px-5 py-4">
          <h2 className="font-medium text-heading">วันหยุดพิเศษ</h2>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-3">
            <Input
              id="holidayDate"
              type="date"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className="max-w-xs"
            />
            <Input
              id="holidayReason"
              placeholder="เหตุผล (ไม่บังคับ)"
              value={holidayReason}
              onChange={(e) => setHolidayReason(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={addHoliday}>เพิ่มวันหยุด</Button>
          </div>
          <div className="mt-4 space-y-2">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-lg bg-primary-muted px-3 py-2"
              >
                <span className="text-sm text-heading">
                  {h.date} {h.reason && `— ${h.reason}`}
                </span>
                <button
                  onClick={() => removeHoliday(h.id)}
                  className="text-muted transition hover:text-heading"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

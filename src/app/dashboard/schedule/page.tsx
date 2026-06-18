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
      <h1 className="text-2xl font-bold">เวลาทำการ</h1>

      <Card>
        <h2 className="mb-4 font-semibold">เวลาเปิด-ปิดรายสัปดาห์</h2>
        <div className="space-y-3">
          {DAY_KEYS.map((day) => (
            <div
              key={day}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-3"
            >
              <label className="flex w-24 items-center gap-2">
                <input
                  type="checkbox"
                  checked={workingHours[day].open}
                  onChange={(e) => updateDay(day, "open", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
              </label>
              {workingHours[day].open && (
                <>
                  <input
                    type="time"
                    value={workingHours[day].start ?? "09:00"}
                    onChange={(e) => updateDay(day, "start", e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                  />
                  <span className="text-gray-400">ถึง</span>
                  <input
                    type="time"
                    value={workingHours[day].end ?? "18:00"}
                    onChange={(e) => updateDay(day, "end", e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                  />
                </>
              )}
              {!workingHours[day].open && (
                <span className="text-sm text-gray-400">ปิดทำการ</span>
              )}
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={saveSchedule} loading={saving}>
          บันทึกเวลาทำการ
        </Button>
      </Card>

      <Card>
        <h2 className="mb-4 font-semibold">วันหยุดพิเศษ</h2>
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
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
            >
              <span className="text-sm">
                {h.date} {h.reason && `— ${h.reason}`}
              </span>
              <button
                onClick={() => removeHoliday(h.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { addMinutes, format, parseISO, startOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import {
  DAY_KEYS,
  type DayKey,
  type WorkingHours,
  DEFAULT_WORKING_HOURS,
  BLOCKING_STATUSES,
} from "@/types";

const TIMEZONE = process.env.APP_TIMEZONE ?? "Asia/Bangkok";

export function parseWorkingHours(json: unknown): WorkingHours {
  if (!json || typeof json !== "object") return DEFAULT_WORKING_HOURS;
  const hours = json as Partial<WorkingHours>;
  const result = { ...DEFAULT_WORKING_HOURS };
  for (const day of DAY_KEYS) {
    if (hours[day]) {
      result[day] = { ...result[day], ...hours[day] };
    }
  }
  return result;
}

export function getDayKey(date: Date): DayKey {
  const zoned = toZonedTime(date, TIMEZONE);
  const index = zoned.getDay();
  const map: DayKey[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return map[index];
}

export function isHolidayDate(
  dateStr: string,
  holidays: { date: Date }[]
): boolean {
  return holidays.some((h) => format(h.date, "yyyy-MM-dd") === dateStr);
}

export function isShopOpenOnDate(
  dateStr: string,
  workingHours: WorkingHours,
  holidays: { date: Date }[]
): boolean {
  if (isHolidayDate(dateStr, holidays)) return false;
  const date = parseISO(`${dateStr}T12:00:00`);
  const dayKey = getDayKey(date);
  return workingHours[dayKey]?.open ?? false;
}

function parseTimeOnDate(dateStr: string, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const local = parseISO(`${dateStr}T00:00:00`);
  local.setHours(hours, minutes, 0, 0);
  return fromZonedTime(local, TIMEZONE);
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}

export function calculateAvailableSlots(params: {
  dateStr: string;
  durationMinutes: number;
  workingHours: WorkingHours;
  holidays: { date: Date }[];
  existingAppointments: { startTime: Date; endTime: Date }[];
}): TimeSlot[] {
  const {
    dateStr,
    durationMinutes,
    workingHours,
    holidays,
    existingAppointments,
  } = params;

  if (!isShopOpenOnDate(dateStr, workingHours, holidays)) {
    return [];
  }

  const date = parseISO(`${dateStr}T12:00:00`);
  const dayKey = getDayKey(date);
  const schedule = workingHours[dayKey];

  if (!schedule.open || !schedule.start || !schedule.end) {
    return [];
  }

  const dayStart = parseTimeOnDate(dateStr, schedule.start);
  const dayEnd = parseTimeOnDate(dateStr, schedule.end);

  const slots: TimeSlot[] = [];
  let cursor = dayStart;

  while (addMinutes(cursor, durationMinutes) <= dayEnd) {
    const slotEnd = addMinutes(cursor, durationMinutes);
    const overlaps = existingAppointments.some(
      (apt) => cursor < apt.endTime && slotEnd > apt.startTime
    );

    const now = new Date();
    if (!overlaps && slotEnd > now) {
      const zonedStart = toZonedTime(cursor, TIMEZONE);
      const zonedEnd = toZonedTime(slotEnd, TIMEZONE);
      slots.push({
        start: cursor,
        end: slotEnd,
        label: `${format(zonedStart, "HH:mm")} - ${format(zonedEnd, "HH:mm")}`,
      });
    }

    cursor = addMinutes(cursor, durationMinutes);
  }

  return slots;
}

export function formatDateTH(date: Date): string {
  const zoned = toZonedTime(date, TIMEZONE);
  return format(zoned, "d MMM yyyy", { locale: undefined });
}

export function formatTimeTH(date: Date): string {
  const zoned = toZonedTime(date, TIMEZONE);
  return format(zoned, "HH:mm");
}

export function getDateRangeForMonth(year: number, month: number): string[] {
  const dates: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(
      `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );
  }
  return dates;
}

export function startOfDayUTC(dateStr: string): Date {
  return startOfDay(parseISO(`${dateStr}T00:00:00`));
}

export { BLOCKING_STATUSES, TIMEZONE };

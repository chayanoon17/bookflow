export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface DaySchedule {
  open: boolean;
  start?: string;
  end?: string;
}

export type WorkingHours = Record<DayKey, DaySchedule>;

export const DAY_KEYS: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "จันทร์",
  tuesday: "อังคาร",
  wednesday: "พุธ",
  thursday: "พฤหัสบดี",
  friday: "ศุกร์",
  saturday: "เสาร์",
  sunday: "อาทิตย์",
};

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  monday: { open: true, start: "09:00", end: "18:00" },
  tuesday: { open: true, start: "09:00", end: "18:00" },
  wednesday: { open: true, start: "09:00", end: "18:00" },
  thursday: { open: true, start: "09:00", end: "18:00" },
  friday: { open: true, start: "09:00", end: "18:00" },
  saturday: { open: false },
  sunday: { open: false },
};

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "รอยืนยัน",
  CONFIRMED: "ยืนยันแล้ว",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
  NO_SHOW: "ไม่มาตามนัด",
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: "bg-pastel-cream text-heading",
  CONFIRMED: "bg-pastel-blue text-heading",
  COMPLETED: "bg-pastel-mint text-heading",
  CANCELLED: "bg-primary-muted text-muted",
  NO_SHOW: "bg-pastel-pink text-heading",
};

export const BLOCKING_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED"];

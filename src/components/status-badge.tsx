import { STATUS_COLORS, STATUS_LABELS, type AppointmentStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: AppointmentStatus | string }) {
  const key = status as AppointmentStatus;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[key] ?? "bg-gray-100 text-gray-600"
      )}
    >
      {STATUS_LABELS[key] ?? status}
    </span>
  );
}

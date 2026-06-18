import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { DashboardOverview } from "@/components/dashboard-overview";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const today = format(new Date(), "yyyy-MM-dd");
  const dayStart = new Date(`${today}T00:00:00.000Z`);
  const dayEnd = new Date(`${today}T23:59:59.999Z`);

  const appointments = await prisma.appointment.findMany({
    where: {
      merchantId: session.user.id,
      startTime: { gte: dayStart, lte: dayEnd },
      status: { notIn: ["CANCELLED"] },
    },
    include: { service: true },
    orderBy: { startTime: "asc" },
  });

  const revenue = appointments
    .filter((a) => a.status !== "NO_SHOW")
    .reduce((sum, a) => sum + a.service.price, 0);

  const uniqueCustomers = new Set(appointments.map((a) => a.customerPhone)).size;

  return (
    <DashboardOverview
      dateLabel={format(new Date(), "d MMMM yyyy")}
      appointments={appointments}
      revenue={revenue}
      uniqueCustomers={uniqueCustomers}
    />
  );
}

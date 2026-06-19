"use client";

import { useEffect, useState } from "react";
import { Card, PASTEL_VARIANTS, type PastelVariant } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPriceTHB } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

const SERVICE_PASTELS: PastelVariant[] = ["pink", "mint", "blue", "cream"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "60",
  });
  const [loading, setLoading] = useState(false);

  async function loadServices() {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data.services ?? []);
  }

  useEffect(() => {
    loadServices();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        durationMinutes: parseInt(form.durationMinutes, 10),
      }),
    });
    setForm({ name: "", description: "", price: "", durationMinutes: "60" });
    setShowForm(false);
    setLoading(false);
    loadServices();
  }

  async function handleDelete(id: string) {
    if (!confirm("ปิดการใช้งานบริการนี้?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    loadServices();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-heading">บริการ</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> เพิ่มบริการ
        </Button>
      </div>

      {showForm && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-pastel-mint px-5 py-4">
            <h2 className="font-medium text-heading">เพิ่มบริการใหม่</h2>
          </div>
          <form onSubmit={handleCreate} className="space-y-4 p-5">
            <Input
              id="name"
              label="ชื่อบริการ"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              id="description"
              label="รายละเอียด (ไม่บังคับ)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                id="price"
                label="ราคา (บาท)"
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Input
                id="duration"
                label="ระยะเวลา (นาที)"
                type="number"
                min="15"
                step="15"
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm({ ...form, durationMinutes: e.target.value })
                }
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={loading}>
                บันทึก
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                ยกเลิก
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {services
          .filter((s) => s.isActive)
          .map((service, i) => {
            const pastel = SERVICE_PASTELS[i % SERVICE_PASTELS.length];
            return (
              <Card key={service.id} className="overflow-hidden p-0">
                <div
                  className={cn(
                    "border-b border-border/50 px-5 py-3",
                    PASTEL_VARIANTS[pastel]
                  )}
                >
                  <h3 className="font-semibold text-heading">{service.name}</h3>
                </div>
                <div className="flex items-start justify-between p-5">
                  <div>
                    {service.description && (
                      <p className="text-sm text-muted">{service.description}</p>
                    )}
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-heading">
                        {formatPriceTHB(service.price)}
                      </span>
                      <span className="text-muted"> · </span>
                      <span className="text-muted">
                        {service.durationMinutes} นาที
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="rounded-lg p-2 text-muted transition hover:bg-pastel-pink/50 hover:text-heading"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
      </div>

      {services.filter((s) => s.isActive).length === 0 && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-pastel-cream px-5 py-4">
            <h2 className="font-medium text-heading">ยังไม่มีบริการ</h2>
          </div>
          <p className="p-5 text-center text-muted">
            เพิ่มบริการแรกเพื่อเริ่มรับจอง
          </p>
        </Card>
      )}
    </div>
  );
}

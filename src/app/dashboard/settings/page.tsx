"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    shopName: "",
    phone: "",
    logoUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/merchant/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.merchant) {
          setForm({
            shopName: data.merchant.shopName ?? "",
            phone: data.merchant.phone ?? "",
            logoUrl: data.merchant.logoUrl ?? "",
          });
        }
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/merchant/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
  }

  const bookingUrl =
    typeof window !== "undefined" && session?.user?.slug
      ? `${window.location.origin}/${session.user.slug}`
      : "";

  function copyLink() {
    if (bookingUrl) {
      navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-heading">ตั้งค่าร้าน</h1>

      {session?.user?.slug && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border bg-pastel-blue px-5 py-4">
            <h2 className="font-medium text-heading">ลิงก์จองสำหรับลูกค้า</h2>
            <p className="mt-1 text-sm text-muted">
              คัดลอกลิงก์นี้แชร์ให้ลูกค้าจองคิว
            </p>
          </div>
          <div className="flex items-center gap-2 p-5">
            <code className="flex-1 rounded-lg bg-primary-muted px-3 py-2 text-sm">
              /{session.user.slug}
            </code>
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-pastel-cream px-5 py-4">
          <h2 className="font-medium text-heading">ข้อมูลร้าน</h2>
        </div>
        <form onSubmit={handleSave} className="space-y-4 p-5">
          <Input
            id="shopName"
            label="ชื่อร้าน"
            value={form.shopName}
            onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            required
          />
          <Input
            id="phone"
            label="เบอร์โทรติดต่อ"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            id="logoUrl"
            label="URL โลโก้"
            type="url"
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://..."
          />
          <Button type="submit" loading={saving}>
            บันทึก
          </Button>
        </form>
      </Card>
    </div>
  );
}

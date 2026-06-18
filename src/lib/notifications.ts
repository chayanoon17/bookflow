export async function notifyMerchantNewBooking(params: {
  shopName: string;
  customerName: string;
  serviceName: string;
  startTime: string;
  referenceCode: string;
}) {
  const token = process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.log("[Notification] LINE_NOTIFY_TOKEN not set, skipping:", params);
    return { sent: false, reason: "no_token" };
  }

  const message = [
    "📅 มีการจองใหม่!",
    `ร้าน: ${params.shopName}`,
    `ลูกค้า: ${params.customerName}`,
    `บริการ: ${params.serviceName}`,
    `เวลา: ${params.startTime}`,
    `รหัส: ${params.referenceCode}`,
  ].join("\n");

  try {
    const res = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ message }),
    });

    return { sent: res.ok, status: res.status };
  } catch (error) {
    console.error("[Notification] Failed to send LINE Notify:", error);
    return { sent: false, reason: "error" };
  }
}

export async function sendCustomerReminder(params: {
  customerName: string;
  customerPhone: string;
  shopName: string;
  startTime: string;
  referenceCode: string;
  confirmUrl: string;
}) {
  // Phase 3: integrate LINE Messaging API or email
  console.log("[Reminder] Would send to", params.customerPhone, params);
  return { sent: false, reason: "not_implemented" };
}

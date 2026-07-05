import { NextResponse } from "next/server";
import { Resend } from "resend";

// TODO: this sends a notification email via Resend for now. Swap for the
// client's preferred list platform (Mailchimp/Klaviyo) if they'd rather
// manage subscriber lists there instead of ad-hoc inbox notifications.
export async function POST(request: Request) {
  const { email } = await request.json();

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "AG Liquidation Website <onboarding@resend.dev>",
    to,
    subject: "New newsletter signup",
    text: `New signup for deal alerts: ${email}`,
  });

  return NextResponse.json({ ok: true });
}

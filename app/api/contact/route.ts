import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactPayload>;
  const { name, email, phone, message } = body;

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
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
    replyTo: email,
    subject: `New contact form submission from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return NextResponse.json({ ok: true });
}

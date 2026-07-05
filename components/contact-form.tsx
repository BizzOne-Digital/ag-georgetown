"use client";

import { useState, FormEvent } from "react";
import { BUSINESS } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function validateField(field: keyof FieldErrors) {
    setErrors((prev) => {
      const next = { ...prev };
      if (field === "name") {
        next.name = name.trim() ? undefined : "Please enter your name.";
      }
      if (field === "email") {
        next.email = !email.trim()
          ? "Please enter your email."
          : !EMAIL_RE.test(email)
            ? "Please enter a valid email address."
            : undefined;
      }
      if (field === "message") {
        next.message = message.trim() ? undefined : "Please enter a message.";
      }
      return next;
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const nextErrors: FieldErrors = {
      name: name.trim() ? undefined : "Please enter your name.",
      email: !email.trim()
        ? "Please enter your email."
        : !EMAIL_RE.test(email)
          ? "Please enter a valid email address."
          : undefined,
      message: message.trim() ? undefined : "Please enter a message.",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 border-[1.5px] gold-border px-8 py-16 text-center">
        <span className="gold-text font-display text-4xl">✓</span>
        <p className="font-body text-body text-ink">
          Thanks - we&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <label htmlFor="contact-name" className="font-body text-sm font-medium text-ink">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => validateField("name")}
          required
          className="mt-2 min-h-[44px] w-full border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink focus:border-gold-start focus:outline-none focus:ring-2 focus:ring-gold-start/40"
        />
        {errors.name && <p className="mt-1 font-body text-xs text-[#B4433C]">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email" className="font-body text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateField("email")}
          required
          className="mt-2 min-h-[44px] w-full border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink focus:border-gold-start focus:outline-none focus:ring-2 focus:ring-gold-start/40"
        />
        {errors.email && <p className="mt-1 font-body text-xs text-[#B4433C]">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-phone" className="font-body text-sm font-medium text-ink">
          Phone <span className="text-ink/40">(optional)</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 min-h-[44px] w-full border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink focus:border-gold-start focus:outline-none focus:ring-2 focus:ring-gold-start/40"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="font-body text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => validateField("message")}
          required
          className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink focus:border-gold-start focus:outline-none focus:ring-2 focus:ring-gold-start/40"
        />
        {errors.message && <p className="mt-1 font-body text-xs text-[#B4433C]">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-[#B4433C]">
          Something went wrong. Please try again or call us directly at {BUSINESS.phone}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden bg-rose px-7 py-3.5 font-body text-sm font-medium text-cream transition-colors duration-300 hover:bg-rose-deep disabled:opacity-70"
      >
        {status === "loading" && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
        )}
        {status === "loading" ? "Sending..." : "Send Message"}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-[150%] rotate-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm transition-transform duration-500 ease-out-soft group-hover:translate-x-[150%] motion-reduce:hidden"
        />
      </button>
    </form>
  );
}

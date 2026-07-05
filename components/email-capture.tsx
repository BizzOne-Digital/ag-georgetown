"use client";

import { useState, FormEvent } from "react";
import { BUSINESS } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="font-body text-sm font-medium text-ink">
        You&apos;re on the list - watch your inbox for first access to new drops.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="min-h-[44px] flex-1 border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink focus:border-gold-start focus:outline-none focus:ring-2 focus:ring-gold-start/40"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="min-h-[44px] shrink-0 bg-rose px-6 py-3 font-body text-sm font-medium text-cream transition-colors duration-300 hover:bg-rose-deep disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Notify Me"}
      </button>
      {status === "error" && (
        <p className="w-full font-body text-xs text-[#B4433C] sm:mt-1">
          Something went wrong. Please try again or call us at {BUSINESS.phone}.
        </p>
      )}
    </form>
  );
}

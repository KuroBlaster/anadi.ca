"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/data/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(`Message from ${name || "Website Visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via ${siteConfig.fullName} website form.`,
    );

    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-2xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none ring-0 placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none ring-0 placeholder:text-ink-soft/70 focus:border-accent-blue"
            placeholder="you@domain.com"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Message</span>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm leading-7 text-ink outline-none ring-0 placeholder:text-ink-soft/70 focus:border-accent-blue"
          placeholder="What are you building, composing, or exploring?"
        />
      </label>
      <button
        type="submit"
        className="mt-6 inline-flex rounded-full bg-accent-gold/85 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-canvas transition-all hover:-translate-y-0.5 hover:bg-accent-gold/95 hover:shadow-[0_0_24px_rgba(177,147,88,0.3)]"
      >
        Send Message
      </button>
    </form>
  );
}

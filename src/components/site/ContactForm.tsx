"use client";

import { useState } from "react";

const topics = ["General question", "Sales", "Support", "Partnerships", "Press"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `[Nex contact] ${topic} — ${name || "Website visitor"}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    window.location.href = `mailto:hello@nex.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card elev-sm p-6 gap-2">
        <div className="card-title text-[16px]">Your email client should be opening now.</div>
        <p className="card-body">
          We prefilled a message to <strong className="text-[var(--color-text)] font-medium">hello@nex.com</strong> with what
          you wrote. If nothing opened, email us directly at{" "}
          <a href="mailto:hello@nex.com" className="text-[var(--color-accent-300)] no-underline">hello@nex.com</a>.
        </p>
        <button className="btn btn-ghost text-[12.5px] self-start mt-1" onClick={() => setSent(false)}>
          ← Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card elev-sm p-6 gap-3.5">
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2">
        <div className="field">
          <label>Name</label>
          <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="field">
          <label>Work email</label>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
          />
        </div>
      </div>
      <div className="field">
        <label>Topic</label>
        <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Message</label>
        <textarea
          className="input"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about what you need."
          style={{ resize: "vertical", fontFamily: "inherit" }}
        />
      </div>
      <button type="submit" className="btn btn-primary text-[13.5px] self-start">Send message</button>
      <div className="text-[11px] text-[var(--color-neutral-500)]">
        This opens your email client with the message ready to send — Nex has no backend to receive it directly.
      </div>
    </form>
  );
}

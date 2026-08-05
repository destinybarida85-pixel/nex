"use client";

import { useEffect, useState } from "react";

const topics = ["General question", "Sales", "Support", "Partnerships", "Press"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  // Lets a link elsewhere on the site (the Enterprise plan's "Talk to
  // sales") land here with the right topic already selected, instead of
  // dropping someone into a blank form after they specifically asked for
  // sales. Read client-side off the real URL rather than useSearchParams —
  // this only needs to run once on mount, not react to navigation.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("topic");
    if (requested && topics.includes(requested)) setTopic(requested);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `[Primue contact] ${topic} from ${name || "Website visitor"}`;
    const body = `${message}\n\nFrom: ${name}\n${email}`;
    window.location.href = `mailto:destinybarida85@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card elev-sm p-6 gap-2">
        <div className="card-title text-[16px]">Your email client should be opening now.</div>
        <p className="card-body">
          We prefilled a message to <strong className="text-[var(--color-text)] font-medium">destinybarida85@gmail.com</strong> with what
          you wrote. If nothing opened, email us directly at{" "}
          <a href="mailto:destinybarida85@gmail.com" className="text-[var(--color-accent-300)] no-underline">destinybarida85@gmail.com</a>.
        </p>
        <button className="btn btn-ghost text-[13.5px] self-start mt-1" onClick={() => setSent(false)}>
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
      <button type="submit" className="btn btn-primary text-[14.5px] self-start">Send message</button>
      <div className="text-[11px] text-[var(--color-neutral-500)]">
        This opens your email client with the message ready to send. Primue has no backend to receive it directly.
      </div>
    </form>
  );
}

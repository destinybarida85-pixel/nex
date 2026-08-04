"use client";

import { useEffect, useState } from "react";
import { IconCopy, IconMail, IconCheckCircle, IconLink } from "@/components/icons";

type Props = {
  invoiceId: string;
  title: string;
  amountLabel: string;
  senderName: string;
};

// The public invoice URL has to be built in the browser: the app runs on
// vercel.app, a custom domain and localhost depending on where you are, and a
// hardcoded base would email clients a link to the wrong site.
function useInvoiceUrl(invoiceId: string) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`${window.location.origin}/invoice/${invoiceId}`);
  }, [invoiceId]);
  return url;
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API is blocked outside a secure context or without
      // permission — fall through to the same confirmation either way is a
      // lie, so only claim success when the write actually worked.
      return false;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    return true;
  }
  return { copied, copy };
}

export default function SendInvoice({ invoiceId, title, amountLabel, senderName }: Props) {
  const url = useInvoiceUrl(invoiceId);
  const { copied, copy } = useCopy();
  const [copyFailed, setCopyFailed] = useState(false);

  const subject = `Invoice from ${senderName}: ${title} (${amountLabel})`;
  const body = [
    `Hi,`,
    ``,
    `Here's your invoice for ${title}.`,
    `Amount due: ${amountLabel}`,
    ``,
    `View and pay it here:`,
    url,
    ``,
    `Thanks,`,
    senderName,
  ].join("\n");

  // mailto: opens whatever mail app the recipient's computer already uses, with
  // everything filled in. Primue does not send this email itself — no mail
  // provider is connected yet — so this is the honest version: one click to a
  // pre-written email you press send on.
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <a href={mailto} className="btn btn-primary text-[13px] gap-1.5">
          <IconMail size={13} />
          Email this invoice
        </a>
        <button
          className="btn btn-secondary text-[13px] gap-1.5"
          onClick={async () => {
            const ok = await copy(url);
            setCopyFailed(!ok);
          }}
        >
          {copied ? <IconCheckCircle size={13} /> : <IconCopy size={13} />}
          {copied ? "Link copied" : "Copy link"}
        </button>
        <a
          href={`/invoice/${invoiceId}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary text-[13px] gap-1.5"
        >
          <IconLink size={13} />
          Preview
        </a>
      </div>
      {copyFailed && (
        <div className="text-[11px]" style={{ color: "var(--color-accent-300)" }}>
          Couldn&rsquo;t reach the clipboard — the link is: {url}
        </div>
      )}
    </div>
  );
}

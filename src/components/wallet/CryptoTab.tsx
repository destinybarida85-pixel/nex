"use client";

import { useState } from "react";
import { generateBtcAddress, generateEthAddress, generateTxHash } from "@/lib/generateCryptoAddress";
import { IconArrowUpCircle, IconArrowDownCircle, IconCheckCircle } from "@/components/icons";

type Asset = {
  key: "btc" | "eth";
  symbol: string;
  name: string;
  color: string;
  balance: number;
  price: number;
  address: string;
};

type CryptoTx = { id: string; asset: "BTC" | "ETH"; type: "Sent" | "Received"; amount: number; hash: string };

export default function CryptoTab() {
  const [assets, setAssets] = useState<Asset[]>([
    { key: "btc", symbol: "₿", name: "Bitcoin", color: "#e8a33d", balance: 0.42891234, price: 64920, address: generateBtcAddress() },
    { key: "eth", symbol: "Ξ", name: "Ethereum", color: "#7fa3e8", balance: 3.102481, price: 3172, address: generateEthAddress() },
  ]);
  const [activity, setActivity] = useState<CryptoTx[]>([
    { id: "t1", asset: "BTC", type: "Received", amount: 0.015, hash: generateTxHash() },
    { id: "t2", asset: "ETH", type: "Sent", amount: 0.42, hash: generateTxHash() },
  ]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendOpen, setSendOpen] = useState<string | null>(null);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  function copyAddress(address: string) {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function submitSend(asset: Asset) {
    const amount = Number(sendAmount);
    if (!amount || amount <= 0 || amount > asset.balance) return;
    setAssets((prev) => prev.map((a) => (a.key === asset.key ? { ...a, balance: a.balance - amount } : a)));
    setActivity((prev) => [
      { id: `t-${Date.now()}`, asset: asset.key.toUpperCase() as "BTC" | "ETH", type: "Sent", amount, hash: generateTxHash() },
      ...prev,
    ]);
    setSendOpen(null);
    setSendTo("");
    setSendAmount("");
  }

  const totalValue = assets.reduce((sum, a) => sum + a.balance * a.price, 0);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-xl p-6 flex flex-col gap-1"
        style={{
          background: "linear-gradient(150deg, var(--color-surface), color-mix(in srgb, var(--color-accent-900) 55%, var(--color-surface)))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Crypto portfolio value</div>
        <div className="font-medium text-[32px] tracking-[-0.015em]">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-[11px] text-[var(--color-neutral-500)] mt-1">
          Demo balances only — not connected to a real blockchain network. No real cryptocurrency is held or transferred.
        </div>
      </div>

      {assets.map((asset) => (
        <div key={asset.key} className="card elev-sm p-4 gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full grid place-items-center text-[17px] font-medium flex-none"
              style={{ background: `color-mix(in srgb, ${asset.color} 20%, transparent)`, color: asset.color }}
            >
              {asset.symbol}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-medium">{asset.name}</div>
              <div className="text-[11px] text-[var(--color-neutral-500)]">
                ${asset.price.toLocaleString()} / {asset.key.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-medium">
                {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {asset.key.toUpperCase()}
              </div>
              <div className="text-[11px] text-[var(--color-neutral-500)]">
                ${(asset.balance * asset.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              className="btn btn-secondary text-xs"
              onClick={() => setRevealed(revealed === asset.key ? null : asset.key)}
            >
              Receive
            </button>
            <button
              className="btn btn-secondary text-xs"
              onClick={() => setSendOpen(sendOpen === asset.key ? null : asset.key)}
            >
              Send
            </button>
          </div>

          {revealed === asset.key && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--color-bg)" }}>
              <span className="font-mono text-[11px] truncate flex-1 min-w-0">{asset.address}</span>
              <button className="btn btn-ghost text-[11px] px-1.5 py-0.5 flex-none" onClick={() => copyAddress(asset.address)}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {sendOpen === asset.key && (
            <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "var(--color-bg)" }}>
              <input
                className="input text-[12px] font-mono"
                placeholder={`Recipient ${asset.key.toUpperCase()} address`}
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              />
              <div className="flex gap-1.5">
                <input
                  className="input text-[12px]"
                  placeholder="Amount"
                  inputMode="decimal"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <button className="btn btn-primary text-[12px] flex-none" onClick={() => submitSend(asset)}>
                  Send
                </button>
              </div>
              <div className="text-[10.5px] text-[var(--color-neutral-500)]">
                Available: {asset.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {asset.key.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="card elev-sm p-4 gap-2.5">
        <div className="card-title text-[13px]">Recent crypto activity</div>
        <div className="flex flex-col">
          {activity.map((tx) => (
            <div key={tx.id} className="flex items-center gap-2.5 py-2">
              <span className="flex-none" style={{ color: tx.type === "Received" ? "#63c3b2" : "var(--color-neutral-400)" }}>
                {tx.type === "Received" ? <IconArrowDownCircle size={16} /> : <IconArrowUpCircle size={16} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px]">{tx.type} {tx.asset}</div>
                <div className="text-[10px] font-mono text-[var(--color-neutral-600)] truncate">{tx.hash.slice(0, 24)}…</div>
              </div>
              <span className="text-[12.5px]" style={{ color: tx.type === "Received" ? "#63c3b2" : "var(--color-neutral-400)" }}>
                {tx.type === "Received" ? "+" : "-"}{tx.amount} {tx.asset}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--color-neutral-500)]">
        <IconCheckCircle size={11} />
        Addresses are freshly generated per session and are for demonstration only.
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  generateBtcAddress,
  generateEthAddress,
  generateUsdtAddress,
  generateBnbAddress,
  generateSolAddress,
  generateTxHash,
} from "@/lib/generateCryptoAddress";
import { IconArrowUpCircle, IconArrowDownCircle, IconCheckCircle, IconQrCode } from "@/components/icons";
import { useHasSession } from "@/lib/useSession";
import { isBackendConfigured } from "@/lib/backendStatus";

// Indicative demo prices, same spirit as the BTC/ETH figures already here —
// not fetched live, since nothing behind this screen is a real market feed.
const PRICES = { btc: 64920, eth: 3172, usdt: 1, bnb: 582, sol: 146 };

type AssetKey = "btc" | "eth" | "usdt" | "bnb" | "sol";
type Asset = {
  key: AssetKey;
  symbol: string;
  name: string;
  color: string;
  balance: number;
  price: number;
  address: string;
  dbId?: string;
};

type CryptoTx = { id: string; asset: string; type: "Sent" | "Received"; amount: number; hash: string };

const initialAssets: Asset[] = [
  { key: "btc", symbol: "₿", name: "Bitcoin", color: "#e8a33d", balance: 0.42891234, price: PRICES.btc, address: generateBtcAddress() },
  { key: "eth", symbol: "Ξ", name: "Ethereum", color: "#7fa3e8", balance: 3.102481, price: PRICES.eth, address: generateEthAddress() },
  { key: "usdt", symbol: "₮", name: "Tether", color: "#4fae7a", balance: 1250.5, price: PRICES.usdt, address: generateUsdtAddress() },
  { key: "bnb", symbol: "B", name: "BNB", color: "#e8c23d", balance: 4.7215, price: PRICES.bnb, address: generateBnbAddress() },
  { key: "sol", symbol: "◎", name: "Solana", color: "#c96bb0", balance: 18.334, price: PRICES.sol, address: generateSolAddress() },
];

export default function CryptoTab() {
  const { hasSession, checked } = useHasSession();
  const [live, setLive] = useState(false);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [activity, setActivity] = useState<CryptoTx[]>([
    { id: "t1", asset: "BTC", type: "Received", amount: 0.015, hash: generateTxHash() },
    { id: "t2", asset: "ETH", type: "Sent", amount: 0.42, hash: generateTxHash() },
  ]);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendOpen, setSendOpen] = useState<string | null>(null);
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  useEffect(() => {
    if (!checked || !isBackendConfigured || !hasSession) return;

    fetch("/api/crypto")
      .then((res) => res.json())
      .then((data) => {
        if (!data.configured || !data.wallets?.length) return;
        setAssets(
          data.wallets.map((w: { id: string; asset: string; address: string; balance: string | number }) => {
            const key = w.asset.toLowerCase() as AssetKey;
            const base = initialAssets.find((a) => a.key === key) ?? initialAssets[0];
            return { ...base, key, balance: Number(w.balance), address: w.address, dbId: w.id };
          })
        );
        setActivity(
          (data.transactions ?? []).map(
            (tx: { id: string; direction: string; amount: string | number; tx_hash: string; wallet_id: string }) => {
              const wallet = data.wallets.find((w: { id: string }) => w.id === tx.wallet_id);
              return {
                id: tx.id,
                asset: wallet?.asset ?? "BTC",
                type: tx.direction === "credit" ? "Received" : "Sent",
                amount: Number(tx.amount),
                hash: tx.tx_hash,
              };
            }
          )
        );
        setLive(true);
      })
      .catch(() => {
        // Stay in local demo mode on any failure.
      });
  }, [checked, hasSession]);

  // Generated fresh whenever a different address is revealed, not kept around
  // for all five up front — nobody scans more than one of these per visit,
  // and it keeps this a genuinely on-demand render rather than five
  // always-running QR encodes.
  useEffect(() => {
    if (!revealed) {
      setQrDataUrl(null);
      return;
    }
    const asset = assets.find((a) => a.key === revealed);
    if (!asset) return;
    let cancelled = false;
    QRCode.toDataURL(asset.address, { margin: 1, width: 176, color: { dark: "#1a1a1f", light: "#ffffff" } })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        // The address is still shown and copyable without the QR image.
      });
    return () => {
      cancelled = true;
    };
  }, [revealed, assets]);

  function copyAddress(address: string) {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function submitSend(asset: Asset) {
    const amount = Number(sendAmount);
    if (!amount || amount <= 0 || amount > asset.balance) return;

    if (live && asset.dbId) {
      const res = await fetch("/api/crypto/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId: asset.dbId, toAddress: sendTo, amount }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setAssets((prev) => prev.map((a) => (a.key === asset.key ? { ...a, balance: Number(data.wallet.balance) } : a)));
      setActivity((prev) => [
        { id: `t-${Date.now()}`, asset: asset.key.toUpperCase(), type: "Sent", amount, hash: data.txHash },
        ...prev,
      ]);
    } else {
      setAssets((prev) => prev.map((a) => (a.key === asset.key ? { ...a, balance: a.balance - amount } : a)));
      setActivity((prev) => [
        { id: `t-${Date.now()}`, asset: asset.key.toUpperCase(), type: "Sent", amount, hash: generateTxHash() },
        ...prev,
      ]);
    }
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
        <div className="flex items-center gap-2">
          <div className="text-[11px] tracking-[.08em] uppercase text-[var(--color-neutral-500)]">Crypto portfolio value</div>
          {live && <span className="tag tag-accent text-[9px]">Saved to your account</span>}
        </div>
        <div className="font-medium text-[32px] tracking-[-0.015em]">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {/* Not a caveat buried in fine print — this is the single most
            important fact on this screen, so it gets the same visual weight
            as the number above it. An internal ledger that merely looks like
            a wallet is exactly the kind of screen someone trusts by mistake. */}
        <div className="text-[12px] mt-1.5 flex items-start gap-1.5" style={{ color: "#e0a35b" }}>
          <IconArrowUpCircle size={13} className="flex-none mt-0.5 rotate-45" />
          <span>
            {live
              ? "An internal ledger in your Primue account, not a real blockchain wallet — no real cryptocurrency is held or transferred."
              : "Demo balances only. Not connected to a real blockchain network, and no real cryptocurrency is held or transferred."}
          </span>
        </div>
      </div>

      {assets.map((asset) => (
        <div key={asset.key} className="card elev-sm p-4 gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-full grid place-items-center text-[15px] font-medium flex-none"
              style={{ background: `color-mix(in srgb, ${asset.color} 20%, transparent)`, color: asset.color }}
            >
              {asset.symbol}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-medium">{asset.name}</div>
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
              <IconQrCode size={12} />
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
            <div className="flex items-center gap-3.5 p-3 rounded-lg flex-wrap" style={{ background: "var(--color-bg)" }}>
              <span className="rounded-lg overflow-hidden flex-none grid place-items-center" style={{ width: 88, height: 88, background: "#fff" }}>
                {qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt={`QR code for ${asset.name} address`} width={88} height={88} />
                ) : (
                  <IconQrCode size={28} className="text-[#c9c9d0]" />
                )}
              </span>
              <div className="flex-1 min-w-[160px] flex flex-col gap-1.5">
                <span className="text-[10.5px] text-[var(--color-neutral-500)]">
                  Scan to send {asset.key.toUpperCase()} to this address
                </span>
                <span className="font-mono text-[11px] break-all">{asset.address}</span>
                <button className="btn btn-ghost text-[11px] px-1.5 py-0.5 self-start" onClick={() => copyAddress(asset.address)}>
                  {copied ? "Copied!" : "Copy address"}
                </button>
              </div>
            </div>
          )}

          {sendOpen === asset.key && (
            <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: "var(--color-bg)" }}>
              <input
                className="input text-[13px] font-mono"
                placeholder={`Recipient ${asset.key.toUpperCase()} address`}
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
              />
              <div className="flex gap-1.5">
                <input
                  className="input text-[13px]"
                  placeholder="Amount"
                  inputMode="decimal"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
                <button className="btn btn-primary text-[13px] flex-none" onClick={() => submitSend(asset)}>
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
        <div className="card-title text-[14px]">Recent crypto activity</div>
        <div className="flex flex-col">
          {activity.map((tx) => (
            <div key={tx.id} className="flex items-center gap-2.5 py-2">
              <span className="flex-none" style={{ color: tx.type === "Received" ? "#63c3b2" : "var(--color-neutral-400)" }}>
                {tx.type === "Received" ? <IconArrowDownCircle size={16} /> : <IconArrowUpCircle size={16} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px]">{tx.type} {tx.asset}</div>
                <div className="text-[10px] font-mono text-[var(--color-neutral-600)] truncate">{tx.hash.slice(0, 24)}…</div>
              </div>
              <span className="text-[13.5px]" style={{ color: tx.type === "Received" ? "#63c3b2" : "var(--color-neutral-400)" }}>
                {tx.type === "Received" ? "+" : "-"}{tx.amount} {tx.asset}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10.5px] text-[var(--color-neutral-500)]">
        <IconCheckCircle size={11} />
        {live
          ? "Balances and addresses are stored in your account and persist across sessions."
          : "Addresses are freshly generated per session and are for demonstration only."}
      </div>
    </div>
  );
}

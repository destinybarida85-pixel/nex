import { paperInk, paperMuted, paperRule } from "./theme";

export default function SignatureBlock({
  signature,
  signerName,
  dateLabel,
  f = 1,
}: {
  signature: string;
  signerName: string;
  dateLabel?: string;
  f?: number;
}) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 6 * f }}>
      {signature.startsWith("data:") ? (
        <img src={signature} alt="Signature" style={{ height: 46 * f, objectFit: "contain", alignSelf: "flex-start" }} />
      ) : (
        <span style={{ fontFamily: "cursive", fontSize: 30 * f, lineHeight: 1, color: paperInk }}>{signature}</span>
      )}
      <div style={{ width: 150 * f, borderTop: `1px solid ${paperRule}`, marginTop: 2 * f }} />
      <div style={{ fontSize: 12.5 * f, fontWeight: 600, color: paperInk }}>{signerName}</div>
      {dateLabel && <div style={{ fontSize: 10.5 * f, color: paperMuted }}>{dateLabel}</div>}
    </div>
  );
}

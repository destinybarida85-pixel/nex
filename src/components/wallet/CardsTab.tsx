import { IconLock } from "@/components/icons";

// The previous version of this tab generated fake card numbers in the
// browser for you to "issue" — every number declined everywhere, since
// nothing was ever actually issued. That's worse than not having the feature:
// a screen that looks like a working virtual-card product until the moment
// someone actually tries to pay with it. Removed rather than kept as a demo,
// per the standing instruction to remove what can't be made real and explain
// what it'd take to fix instead.
//
// Real spendable cards need a licensed card-issuing partner behind them —
// Stripe Issuing is the most common choice elsewhere, but it isn't available
// in every country, including Nigeria. Nigeria-focused alternatives worth
// looking into are Sudo Africa and Bridgecard, both card-issuing APIs built
// for this market — but their current pricing, requirements and approval
// process aren't something to state as fact without checking directly, and
// signing up is something only the business owner can do (identity/business
// verification, a signed agreement, live API keys). Once that account exists,
// wiring the API in here is a normal integration, the same shape as Stripe
// and Resend elsewhere in this app.
export default function CardsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-start gap-3 p-5 rounded-xl"
        style={{ background: "var(--color-surface)", boxShadow: "var(--shadow-sm)" }}
      >
        <span
          className="w-10 h-10 rounded-full grid place-items-center flex-none"
          style={{ background: "color-mix(in srgb, #e0a35b 18%, transparent)", color: "#e0a35b" }}
        >
          <IconLock size={17} />
        </span>
        <div className="flex flex-col gap-2">
          <div className="text-[14.5px] font-medium">Cards aren&rsquo;t available yet</div>
          <div className="text-[13px] text-[var(--color-neutral-400)] leading-[1.65] max-w-[560px]">
            A working virtual or physical card needs a licensed card-issuing partner behind it — this isn&rsquo;t
            something that can be simulated. Everything else in your wallet (balances, payment links, payouts) is
            real; a fake card number that declines everywhere would be worse than no card at all, so it&rsquo;s
            been removed rather than kept as a demo.
          </div>
          <div className="text-[12.5px] text-[var(--color-neutral-500)] leading-[1.65] max-w-[560px]">
            To make this real: Stripe Issuing is the usual path, but it isn&rsquo;t offered in every country.
            Card-issuing APIs built for the Nigerian market — Sudo Africa and Bridgecard are two worth
            researching — are worth looking into instead. Whichever you go with needs its own business
            application and approval before there&rsquo;s an API key to connect; that part has to happen on
            your end. Once you have one, connecting it here is a normal integration.
          </div>
        </div>
      </div>
    </div>
  );
}

import LegalLayout from "@/components/site/LegalLayout";

// Same principle as the privacy policy: describe the product honestly, and
// leave anything only the business owner can decide as a visible [BRACKET]
// rather than inventing it. The previous version claimed Delaware governing
// law and a "Primue Inc." entity, neither of which is established.
const H = "text-[18px] text-[var(--color-text)] font-medium";
const S = "text-[var(--color-text)] font-medium";

export default function TermsPage() {
  return (
    <LegalLayout kicker="Legal" title="Terms of Service" updated="August 3, 2026">
      <div
        className="p-3.5 rounded-lg text-[13px] leading-[1.6]"
        style={{ background: "color-mix(in srgb, #e0a35b 14%, transparent)", color: "#e0a35b" }}
      >
        <strong>Draft — not yet reviewed by a lawyer.</strong> Complete everything in [square brackets] and have a
        qualified lawyer in your jurisdiction review this before publishing. Clauses that limit liability or set a
        governing law are exactly the ones that fail when they are copied rather than drafted.
      </div>

      <p>
        These Terms govern your use of the Primue platform (the &ldquo;Service&rdquo;), operated by [Legal entity
        name] of [Registered address] (&ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account or using the
        Service you agree to them. If you are agreeing on behalf of an organisation, you confirm you are authorised
        to bind it.
      </p>

      <section>
        <h2 className={H}>1. What the Service is</h2>
        <p className="mt-2">
          Primue provides software for running a business: a wallet view, payment links and invoicing, AI-assisted
          document drafting, electronic signature, certificates, payroll and HR records, CRM, analytics, and
          white-label client-facing pages.
        </p>
        <p className="mt-2">
          <strong className={S}>We are a software provider — not a bank, payment institution, law firm or
          accountant.</strong> We do not hold your money, give legal advice, or provide financial advice.
        </p>
      </section>

      <section>
        <h2 className={H}>2. Payments are processed by Stripe</h2>
        <p className="mt-2">
          Money paid through your payment links and invoices is processed by <strong className={S}>Stripe</strong>{" "}
          and settles to <strong className={S}>your own Stripe account</strong>, not to us. Your use of Stripe is
          governed by Stripe&rsquo;s own agreement with you, and Stripe decides matters such as payouts, holds,
          refunds and disputes. Balances shown in Primue reflect records we receive from Stripe and are for
          information only.
        </p>
        <p className="mt-2">
          You are responsible for what you charge for, for refunds and chargebacks, and for any tax on money you
          collect.
        </p>
      </section>

      <section>
        <h2 className={H}>3. Electronic signatures</h2>
        <p className="mt-2">
          The Service records signatures with a timestamp, the signer&rsquo;s IP address and a tamper-evident hash
          chain, designed to help show a document was not altered after signing.
        </p>
        <p className="mt-2">
          <strong className={S}>Whether an electronic signature is legally binding depends on your jurisdiction and
          the type of document.</strong> Some instruments — certain deeds, wills and land transfers among them —
          may require a wet signature, witnesses, notarisation or registration. We make no representation that a
          document signed through the Service satisfies those requirements. Confirm with a lawyer before relying on
          an electronic signature for anything that matters.
        </p>
      </section>

      <section>
        <h2 className={H}>4. AI features</h2>
        <p className="mt-2">
          AI-generated documents, certificate wording and assistant responses are produced automatically and may be
          inaccurate, incomplete or unsuitable for your situation. They are drafts, not advice. You are responsible
          for reviewing anything before you use, sign or send it.
        </p>
        <p className="mt-2">
          Using these features sends your content to a third-party AI provider — see the{" "}
          <a href="/privacy" className="text-[var(--color-accent-300)] no-underline">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2 className={H}>5. Features shown as previews</h2>
        <p className="mt-2">
          Parts of the Service are clearly marked as previews or demonstrations and do not perform a real
          transaction. In particular, <strong className={S}>the card feature does not issue a usable payment
          card</strong> — the numbers shown are generated for demonstration and cannot be used to pay for anything.
          Anything labelled a preview, specimen or sample is exactly that.
        </p>
      </section>

      <section>
        <h2 className={H}>6. Your responsibilities</h2>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5">
          <li>Keep your login credentials secure; you are responsible for activity under your account.</li>
          <li>Provide accurate information, and keep your business and tax details current.</li>
          <li>Only upload content you have the right to use, including logos, images and signatures.</li>
          <li>Do not use the Service for anything unlawful, fraudulent, or to produce misleading documents.</li>
          <li>Comply with data protection law for any personal data you put into the Service about other people.</li>
        </ul>
      </section>

      <section>
        <h2 className={H}>7. Your content</h2>
        <p className="mt-2">
          You keep ownership of everything you create or upload. You grant us only the licence needed to host,
          process and display it so the Service can work — including sending it to the sub-processors listed in the
          Privacy Policy. We do not use your content to train AI models.
        </p>
      </section>

      <section>
        <h2 className={H}>8. Plans, billing and credits</h2>
        <p className="mt-2">
          Subscription plans and credit packs (stamp credits, certificate credits) are billed through Stripe.
          Credits are consumed when used and are [refundable / non-refundable — decide and state which]. We may
          change pricing on [number] days&rsquo; notice.
        </p>
      </section>

      <section>
        <h2 className={H}>9. Availability</h2>
        <p className="mt-2">
          We aim to keep the Service available but do not guarantee uninterrupted access. We may change, suspend or
          discontinue features. Where a change materially reduces functionality you rely on, we will give
          reasonable notice.
        </p>
      </section>

      <section>
        <h2 className={H}>10. Termination</h2>
        <p className="mt-2">
          You may close your account at any time. We may suspend or terminate an account that breaches these Terms
          or is used unlawfully. You can export your data before closing; after closure we handle it as set out in
          the Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className={H}>11. Disclaimers and liability</h2>
        <p className="mt-2">
          The Service is provided &ldquo;as is&rdquo;, without warranties of any kind to the maximum extent
          permitted by law. To the extent permitted by law, our total liability arising from the Service is limited
          to [the amount you paid us in the preceding 12 months], and we are not liable for indirect or
          consequential loss, lost profits, or lost data.
        </p>
        <p className="mt-2">
          [Some jurisdictions do not permit these limitations. Have a lawyer confirm what is enforceable where you
          operate — an unenforceable limitation clause offers no protection at all.]
        </p>
      </section>

      <section>
        <h2 className={H}>12. Governing law</h2>
        <p className="mt-2">
          These Terms are governed by the laws of [jurisdiction — e.g. the Federal Republic of Nigeria], and
          disputes will be resolved in the courts of [venue].
        </p>
      </section>

      <section>
        <h2 className={H}>13. Contact</h2>
        <p className="mt-2">Questions about these Terms: [legal@primue.com].</p>
      </section>
    </LegalLayout>
  );
}

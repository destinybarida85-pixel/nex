import LegalLayout from "@/components/site/LegalLayout";

// Written to describe what this application actually does, not what a generic
// SaaS template assumes. The parts only the business owner can supply — legal
// entity, registered address, governing jurisdiction, DPO contact — are left as
// visible [SQUARE BRACKETS] rather than filled with plausible-looking
// placeholders, because a privacy policy that quietly misstates who the
// controller is or where they're incorporated is worse than one that is
// obviously unfinished.
const H = "text-[18px] text-[var(--color-text)] font-medium";
const S = "text-[var(--color-text)] font-medium";

export default function PrivacyPage() {
  return (
    <LegalLayout kicker="Legal" title="Privacy Policy" updated="August 3, 2026">
      <div
        className="p-3.5 rounded-lg text-[13px] leading-[1.6]"
        style={{ background: "color-mix(in srgb, #e0a35b 14%, transparent)", color: "#e0a35b" }}
      >
        <strong>Draft — not yet reviewed by a lawyer.</strong> Everything in [square brackets] must be completed
        before this is published, and the whole document should be checked by a qualified lawyer in your
        jurisdiction. It is written to describe accurately what this software does, but that is not the same thing
        as legal advice.
      </div>

      <p>
        [Legal entity name] (&ldquo;Primue,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) provides a white-label
        business operating system covering business wallets, AI-assisted documents, e-signature, certificates,
        invoicing, HR &amp; payroll, CRM and analytics (the &ldquo;Service&rdquo;). This policy explains what we
        collect, why, and who else sees it. It applies to visitors to primue.com and to organisations and
        individuals using the Service (&ldquo;you&rdquo;).
      </p>
      <p>
        Registered address: [Registered business address]. Privacy contact: [privacy@primue.com].
      </p>

      <section>
        <h2 className={H}>1. What we collect</h2>
        <p className="mt-2">
          <strong className={S}>Account data</strong> — name, email, business name, and a password stored only as a
          salted hash. If you sign in with Google we receive your name, email and profile picture from Google.
        </p>
        <p className="mt-2">
          <strong className={S}>Content you create</strong> — documents, contracts, certificates, invoices, payroll
          records, client records, uploaded logos and images, and the signatures drawn or typed into documents.
        </p>
        <p className="mt-2">
          <strong className={S}>Signature evidence</strong> — when a document is signed we record the signer&rsquo;s
          name, the time, their IP address and browser user-agent, and a cryptographic hash chain of the document
          and signature. This exists so a signature can be shown to be genuine and untampered later. It is retained
          with the document.
        </p>
        <p className="mt-2">
          <strong className={S}>Payment records</strong> — amounts, currency, payment status, and the email address a
          payer gives at checkout. <strong className={S}>We never receive or store card numbers</strong>; those go
          directly to Stripe.
        </p>
        <p className="mt-2">
          <strong className={S}>Usage data</strong> — pages visited, features used, browser and device type, IP
          address and timestamps.
        </p>
      </section>

      <section>
        <h2 className={H}>2. How the AI features handle your content</h2>
        <p className="mt-2">
          The AI Assistant, document drafting and certificate wording generate text using a specialist{" "}
          <strong className={S}>third-party AI provider</strong>. To do that, the request you make and the document
          being worked on are processed by that provider on our behalf, under a contract that requires them to keep
          it confidential, use it only to return your result, and{" "}
          <strong className={S}>not use it to train their models</strong>.
        </p>
        <p className="mt-2">
          Content sent to the AI features is transmitted encrypted and is not retained by the provider for their own
          purposes. As with any cloud service, use your judgement about what you put into it.
        </p>
        <p className="mt-2">
          The rest of the Service does not involve AI at all — your wallet, payment links, stored documents, signing
          and certificates are processed only by us and the providers listed below.
        </p>
        <p className="mt-2">
          <strong className={S}>AI output is a draft, not advice.</strong> Anything with legal or financial effect
          should be reviewed by a qualified professional before you rely on it or send it to anyone.
        </p>
      </section>

      <section>
        <h2 className={H}>3. Who else processes your data</h2>
        <p className="mt-2">We do not sell personal information. These sub-processors handle it on our behalf:</p>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5">
          <li>
            <strong className={S}>Supabase</strong> — database, authentication and file storage. Holds essentially
            all Service data.
          </li>
          <li>
            <strong className={S}>Stripe</strong> — payment processing, checkout and payouts. Receives payer card
            details directly; we never see them.
          </li>
          <li>
            <strong className={S}>Our AI provider</strong> — text generation for the AI features, as described in
            section 2. Named on request.
          </li>
          <li>
            <strong className={S}>Vercel</strong> — application hosting and delivery. Processes request metadata
            including IP addresses.
          </li>
          <li>
            <strong className={S}>Google</strong> — only if you choose to sign in with Google.
          </li>
        </ul>
        <p className="mt-2">
          We also disclose information where legally required, and to other users inside your own organisation
          according to the permissions your administrator sets.
        </p>
        <p className="mt-2">
          These providers operate in [list countries/regions], so your data may be processed outside [your country].
        </p>
      </section>

      <section>
        <h2 className={H}>4. Links you share are public</h2>
        <p className="mt-2">
          Signing links, invoice links and certificate verification links are deliberately reachable by anyone who
          has the link, without signing in — that is how the person you send them to can open them. The link&rsquo;s
          random identifier is the only thing protecting it. Treat these links as you would an unlisted document:
          anyone you forward one to can see its contents.
        </p>
      </section>

      <section>
        <h2 className={H}>5. How long we keep it</h2>
        <p className="mt-2">
          Account and business data is kept while your account is active. Signed documents and their signature
          evidence are kept for [retention period] because their value depends on being able to prove later that a
          signature was genuine. Payment records are kept as long as tax and accounting law requires — see
          [applicable requirement].
        </p>
        <p className="mt-2">
          On deletion request we remove your data within [number] days, except where we are legally required to keep
          records.
        </p>
      </section>

      <section>
        <h2 className={H}>6. Your rights</h2>
        <p className="mt-2">
          Depending on where you live you may have the right to access, correct, export or delete your personal
          data, to object to processing, and to complain to a data protection authority. To exercise any of these,
          contact [privacy@primue.com]. We respond within [number] days.
        </p>
        <p className="mt-2">
          If you are in Nigeria, the Nigeria Data Protection Act 2023 applies and your supervisory authority is the
          Nigeria Data Protection Commission. If you are in the EU/UK, GDPR rights apply. [Confirm which regimes
          apply to your business with a lawyer.]
        </p>
      </section>

      <section>
        <h2 className={H}>7. Security</h2>
        <p className="mt-2">
          Data is encrypted in transit. Passwords are salted and hashed and never stored in readable form. Access
          between customer accounts is isolated at the database level. No system is perfectly secure; if a breach
          affects your data we will notify you and the relevant authority as required by law.
        </p>
      </section>

      <section>
        <h2 className={H}>8. Children</h2>
        <p className="mt-2">
          The Service is for business use and is not directed at anyone under 18. We do not knowingly collect data
          from children.
        </p>
      </section>

      <section>
        <h2 className={H}>9. Changes</h2>
        <p className="mt-2">
          We will post any change here and update the date above. For changes that materially affect your rights we
          will notify you by email before they take effect.
        </p>
      </section>
    </LegalLayout>
  );
}

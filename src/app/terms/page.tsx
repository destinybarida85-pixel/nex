import LegalLayout from "@/components/site/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout kicker="Legal" title="Terms of Service" updated="July 21, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern access to and use of Origin, a white-label business operating
        system covering business wallets, AI-assisted documents, e-signature, HR &amp; payroll, CRM and analytics (the
        &ldquo;Service&rdquo;), provided by Origin Inc. (&ldquo;Origin,&rdquo; &ldquo;we&rdquo;). By creating an account or using
        the Service, you agree to these Terms on behalf of yourself and, if applicable, the organization you represent.
      </p>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">1. Eligibility &amp; accounts</h2>
        <p className="mt-2">
          You must be at least 18 years old and able to form a binding contract to use the Service. You are responsible
          for the accuracy of information you provide, for safeguarding your credentials, and for all activity under your
          account.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">2. Payment services</h2>
        <p className="mt-2">
          Origin is a software platform, not a bank or a payment processor. Payments made through the Service are
          processed by Stripe, subject to Stripe&rsquo;s own terms and applicable regulation. Origin does not hold or
          custody funds on your behalf, and is not responsible for the acts or omissions of Stripe, except as required
          by law.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">3. Acceptable use</h2>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5">
          <li>No unlawful, fraudulent, or deceptive use of the Service, including money laundering or sanctions evasion.</li>
          <li>No attempt to reverse-engineer, disrupt, or gain unauthorized access to the Service or other tenants&rsquo; data.</li>
          <li>No use that infringes the intellectual property or privacy rights of others.</li>
          <li>No use of the AI assistant to generate content that is unlawful, defamatory, or knowingly false in a legal document.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">4. AI-generated content</h2>
        <p className="mt-2">
          The AI assistant drafts documents and suggestions based on your prompts. AI output may contain errors and does
          not constitute legal, tax, or financial advice. You are responsible for reviewing any AI-generated content
          before relying on it or sending it for signature.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">5. E-signatures &amp; documents</h2>
        <p className="mt-2">
          Documents signed through the Service are sealed with a tamper-evident certificate and audit trail intended to
          satisfy applicable e-signature laws (such as the U.S. ESIGN Act and UETA). It is your responsibility to confirm
          that electronic signatures are legally sufficient for your specific use case and jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">6. White-label &amp; sub-tenants</h2>
        <p className="mt-2">
          If you operate a white-label instance of Origin for your own clients (a &ldquo;Tenant Operator&rdquo;), you are
          responsible for your clients&rsquo; compliance with these Terms, for the accuracy of your own branding, and for
          providing your clients with a privacy notice covering their use of your branded portal. Origin remains the
          underlying processor of the Service infrastructure.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">7. Fees &amp; billing</h2>
        <p className="mt-2">
          Paid plans are billed in advance on a monthly or annual basis as selected at checkout. Fees are non-refundable
          except where required by law. We may change pricing with at least 30 days&rsquo; notice before it applies to
          your next billing cycle.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">8. Intellectual property</h2>
        <p className="mt-2">
          Origin retains all rights to the Service, its software, and its branding. You retain all rights to the content and
          data you upload or generate through the Service (&ldquo;Customer Data&rdquo;) and grant us a limited license to
          host and process it solely to provide the Service to you.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">9. Termination</h2>
        <p className="mt-2">
          You may stop using the Service and close your account at any time. We may suspend or terminate access for
          material breach of these Terms, suspected fraud, or as required by our payment processor or applicable law. Upon
          termination, we will make reasonable efforts to provide export of your Customer Data for a limited period.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">10. Disclaimers &amp; limitation of liability</h2>
        <p className="mt-2">
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. To the maximum
          extent permitted by law, Origin will not be liable for indirect, incidental, or consequential damages, and our
          total liability for any claim will not exceed the fees you paid in the 12 months preceding the claim.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">11. Governing law</h2>
        <p className="mt-2">
          These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-law principles,
          unless a mandatory local law provides otherwise.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">12. Changes to these Terms</h2>
        <p className="mt-2">
          We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes
          acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">13. Contact us</h2>
        <p className="mt-2">
          Questions about these Terms can be sent to{" "}
          <a href="mailto:legal@origin.io" className="text-[var(--color-accent-300)] no-underline">legal@origin.io</a> or via
          our <a href="/contact" className="text-[var(--color-accent-300)] no-underline">contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

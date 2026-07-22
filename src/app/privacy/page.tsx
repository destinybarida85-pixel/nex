import LegalLayout from "@/components/site/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout kicker="Legal" title="Privacy Policy" updated="July 21, 2026">
      <p>
        Origin Inc. (&ldquo;Origin,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) provides a white-label business
        operating system covering business wallets, AI-assisted documents, e-signature, HR &amp; payroll, CRM and analytics
        (the &ldquo;Service&rdquo;). This Privacy Policy explains what information we collect, how we use it, and the
        choices you have. It applies to visitors of our marketing site and to organizations and individuals who use the
        Service (&ldquo;Customers,&rdquo; &ldquo;you&rdquo;).
      </p>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">1. Information we collect</h2>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Account &amp; profile data</strong>: name, work email,
          company name, role, password (stored as a salted hash), and any profile photo you upload.
        </p>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Business &amp; financial data</strong>: transaction
          records, virtual account and routing details, invoices, payroll runs, and documents you create or upload in the
          Service. Funds movement and account issuance are handled by our licensed banking partner, and Origin stores the
          associated records needed to display them back to you.
        </p>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Usage data</strong>: pages visited, features used,
          device and browser type, IP address, and timestamps, collected automatically to keep the Service reliable and
          secure.
        </p>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Cookies &amp; local storage</strong>: small pieces of
          data stored in your browser to keep you signed in and understand aggregate product usage. See our{" "}
          <a href="/cookies" className="text-[var(--color-accent-300)] no-underline">Cookie Policy</a> for
          details.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">2. How we use information</h2>
        <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5">
          <li>To provide, maintain and secure the Service, including authentication and fraud prevention.</li>
          <li>To operate wallet, payroll, e-signature and AI document features you actively use.</li>
          <li>To communicate with you about your account, security notices, and product updates.</li>
          <li>To improve the Service through aggregated, de-identified usage analysis.</li>
          <li>To comply with legal, tax, and regulatory obligations, including those of our banking partner.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">3. How we share information</h2>
        <p className="mt-2">
          We do not sell your personal information. We share it only with: (a) our licensed banking partner and payment
          processors to move money and issue accounts on your behalf; (b) infrastructure and sub-processors that host or
          secure the Service under contractual confidentiality obligations; (c) other users within your own organization
          or white-label tenant, according to the permissions your administrator sets; and (d) authorities, where required
          by law, regulation, or valid legal process.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">4. Data security</h2>
        <p className="mt-2">
          We use encryption in transit and at rest, role-based access controls, and audit logging across the Service.
          E-signed documents are sealed with a tamper-evident certificate and audit trail. No method of transmission or
          storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">5. Data retention</h2>
        <p className="mt-2">
          We retain account and transaction data for as long as your account is active and as needed to meet legal,
          accounting, and banking-partner recordkeeping requirements after closure. You may request deletion of data that
          is not subject to a legal retention obligation.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">6. Your rights &amp; choices</h2>
        <p className="mt-2">
          Depending on your location, you may have the right to access, correct, export, or delete your personal
          information, and to object to or restrict certain processing. You can update most account information directly
          in your <a href="/profile" className="text-[var(--color-accent-300)] no-underline">profile settings</a>, or reach
          us using the details below to exercise these rights.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">7. Children&rsquo;s privacy</h2>
        <p className="mt-2">
          The Service is intended for business use by adults and organizations. We do not knowingly collect personal
          information from children under 16.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">8. International transfers</h2>
        <p className="mt-2">
          We and our sub-processors may process information in countries other than your own. Where required, we rely on
          appropriate legal safeguards for such transfers.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">9. Changes to this policy</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Material changes will be announced within the Service or
          by email. The &ldquo;Last updated&rdquo; date above reflects the most recent revision.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">10. Contact us</h2>
        <p className="mt-2">
          Questions about this policy or your data can be sent to{" "}
          <a href="mailto:privacy@origin.io" className="text-[var(--color-accent-300)] no-underline">privacy@origin.io</a> or via
          our <a href="/contact" className="text-[var(--color-accent-300)] no-underline">contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

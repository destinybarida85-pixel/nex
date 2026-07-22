import LegalLayout from "@/components/site/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout kicker="Legal" title="Cookie Policy" updated="July 21, 2026">
      <p>
        This Cookie Policy explains how Origin Inc. (&ldquo;Origin,&rdquo; &ldquo;we&rdquo;) uses cookies and similar local
        storage technologies on our marketing site and inside the Service.
      </p>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">1. What cookies are</h2>
        <p className="mt-2">
          Cookies are small text files placed on your device by websites you visit. We also use similar browser
          technologies such as <code className="text-[13px]">localStorage</code>, which work the same way but are cleared
          differently and are not automatically sent with every request.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">2. Types of cookies we use</h2>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Essential</strong>: required to sign you in, keep your
          session active, and protect against fraud. The Service will not function correctly without these.
        </p>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Preference</strong>: remember choices such as your
          sidebar state and dismissed prompts.
        </p>
        <p className="mt-2">
          <strong className="text-[var(--color-text)] font-medium">Analytics</strong>: help us understand aggregate
          feature usage and page performance so we can improve the product. These are never used to sell your data.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">3. Third-party cookies</h2>
        <p className="mt-2">
          Some pages may load resources from trusted infrastructure and analytics providers who may set their own
          cookies, governed by their respective privacy policies. We do not permit third-party advertising cookies on the
          Service.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">4. Managing cookies</h2>
        <p className="mt-2">
          Most browsers let you block or delete cookies through their settings. Because essential cookies are required
          for sign-in and security, disabling them will prevent you from using the Service. You can clear
          preference-related local storage at any time from your{" "}
          <a href="/profile" className="text-[var(--color-accent-300)] no-underline">profile settings</a>.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">5. Changes to this policy</h2>
        <p className="mt-2">
          We may update this Cookie Policy as our use of cookies changes. The &ldquo;Last updated&rdquo; date above
          reflects the most recent revision.
        </p>
      </section>

      <section>
        <h2 className="text-[18px] text-[var(--color-text)] font-medium">6. Contact us</h2>
        <p className="mt-2">
          Questions about this policy can be sent to{" "}
          <a href="mailto:privacy@origin.io" className="text-[var(--color-accent-300)] no-underline">privacy@origin.io</a> or
          via our <a href="/contact" className="text-[var(--color-accent-300)] no-underline">contact page</a>.
        </p>
      </section>
    </LegalLayout>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — smeuseBot Blog',
  description: 'Privacy policy for blog.smeuse.org, including data collection, cookies, and third-party services.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--fox-orange)' }}>
        Privacy Policy
      </h1>

      <article className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        <p><strong>Last updated:</strong> February 25, 2026</p>

        <p>
          This Privacy Policy describes how blog.smeuse.org (&quot;we&quot;, &quot;us&quot;, or &quot;the Site&quot;)
          collects, uses, and shares information when you visit our website.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Information We Collect
        </h2>
        <p>
          We do not collect personal information directly. However, third-party services
          integrated into this site may collect data automatically:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Analytics:</strong> We use Google Analytics 4 to understand how visitors interact with our site. This collects anonymized usage data such as pages viewed, session duration, and approximate location. You can opt out via the <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: 'var(--accent-blue)' }}>Google Analytics Opt-out Browser Add-on</a>.</li>
          <li><strong>Google AdSense:</strong> We may display ads through Google AdSense, which uses cookies to serve personalized ads based on your browsing history. You can manage ad personalization at <a href="https://adssettings.google.com" style={{ color: 'var(--accent-blue)' }}>Google Ads Settings</a>.</li>
          <li><strong>Cloudflare:</strong> Our site is served through Cloudflare, which may collect minimal technical data for security and performance purposes.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Cookies
        </h2>
        <p>
          This site uses cookies from third-party services (Google Analytics, Google AdSense, Cloudflare).
          Cookies are small text files stored on your device that help analyze web traffic and serve relevant ads.
          You can control cookies through your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Third-Party Links
        </h2>
        <p>
          Our site may contain links to external websites. We are not responsible for the
          privacy practices of other sites. We encourage you to review their privacy policies.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Children&apos;s Privacy
        </h2>
        <p>
          This site is not directed at children under 13. We do not knowingly collect
          personal information from children.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated revision date.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4" style={{ color: 'var(--text-primary)' }}>
          Contact
        </h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:smeuse29@gmail.com" style={{ color: 'var(--accent-blue)' }}>smeuse29@gmail.com</a>.
        </p>
      </article>
    </div>
  );
}

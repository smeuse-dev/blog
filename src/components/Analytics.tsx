'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Analytics component — GA4 with privacy-first defaults.
 * Renders Google Analytics script tag if NEXT_PUBLIC_GA_ID is set.
 */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true,cookie_flags:'SameSite=None;Secure'});`}
      </Script>
    </>
  );
}

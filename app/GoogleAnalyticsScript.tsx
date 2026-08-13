import Script from "next/script";

// Public so the client bundle can read it; falls back to the prod id so
// `npm run dev` still reports to the real property. Set NEXT_PUBLIC_GA_ID=""
// on preview branches to disable analytics entirely (guard below).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-C5YZG2MB3Q";

// Loaded with strategy="lazyOnload" so gtag.js doesn't contend with first
// paint — Lighthouse flagged ~62 KiB of unused gtag JS with an estimated
// ~450 ms LCP saving on mobile. Analytics is non-critical, so deferring it
// until the browser is idle is the right trade.
const GoogleAnalyticsScript = () => {
  // Empty string = opt-out (preview branches). Avoids firing a broken
  // request to gtag with no id.
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
      </Script>
    </>
  );
};

export default GoogleAnalyticsScript;

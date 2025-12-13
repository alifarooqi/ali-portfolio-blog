import Script from "next/script";

const GoogleAnalyticsScript = () => {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-C5YZG2MB3Q"
        strategy="afterInteractive"
      />
      <Script id="ga" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C5YZG2MB3Q');
          `}
      </Script>
    </>
  );
};

export default GoogleAnalyticsScript;

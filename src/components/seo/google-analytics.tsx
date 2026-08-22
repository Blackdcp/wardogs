import Script from "next/script";

export const GOOGLE_TAG_ID = "G-0GJ404WEYV";

export function googleAnalyticsScriptSrc() {
  return `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`;
}

export function googleAnalyticsConfigScript() {
  return `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_TAG_ID}');
        `;
}

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={googleAnalyticsScriptSrc()}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {googleAnalyticsConfigScript()}
      </Script>
    </>
  );
}

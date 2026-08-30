export const ADSENSE_CLIENT_ID = "ca-pub-9912575932665397";
export const ADSENSE_SCRIPT_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

export function GoogleAdsense() {
  return (
    <>
      <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
      <script async crossOrigin="anonymous" src={ADSENSE_SCRIPT_SRC} />
    </>
  );
}

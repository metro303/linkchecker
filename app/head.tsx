export default function Head() {
  return (
    <>
      <title>KHAB555 Redirect Monitor</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      
      {/* Prevent Search Engine Indexing */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Favicon & PWA */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </>
  );
}

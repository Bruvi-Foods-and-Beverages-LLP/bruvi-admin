/**
 * Enterprise Content Security Policy (CSP) Generator
 * Adheres to modern web security standards with strict nonces and zero frame embedding.
 */
export function generateCspHeader(nonce: string): { cspHeader: string; nonce: string } {
  const isDev =
    process.env.NODE_ENV === "development" ||
    (process.env.NODE_ENV as string) === "staging" ||
    process.env.APP_ENV === "staging" ||
    process.env.NEXT_PUBLIC_APP_ENV === "staging";

  // In development, Next.js hot module reloading requires eval and local websockets
  const scriptSrc = isDev
    ? `'self' 'unsafe-eval' 'nonce-${nonce}' https://maps.googleapis.com https://maps.gstatic.com`
    : `'self' 'nonce-${nonce}' 'strict-dynamic' https://maps.googleapis.com https://maps.gstatic.com`;

  const cspDirectives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, // Required for dynamic CSS variables and Tailwind v4 theme
    `img-src 'self' blob: data: https:`,
    `font-src 'self' data: https:`,
    `connect-src 'self' https: wss: https://maps.googleapis.com http://staging.bruvi.in ws://staging.bruvi.in http://54.79.16.169 http://ec2-54-79-16-169.ap-southeast-2.compute.amazonaws.com http://13.211.164.61 http://ec2-13-211-164-61.ap-southeast-2.compute.amazonaws.com ${isDev ? "ws: http: http://localhost:3000 http://localhost:3001 ws://localhost:3001" : ""}`,
    `worker-src 'self' blob:`,
    `frame-src 'self' https://www.google.com https://maps.google.com`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    `base-uri 'none'`,
    `object-src 'none'`,
  ];

  return {
    cspHeader: cspDirectives.join("; "),
    nonce,
  };
}


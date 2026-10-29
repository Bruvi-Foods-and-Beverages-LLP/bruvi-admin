/**
 * Enterprise Content Security Policy (CSP) Generator
 * Adheres to modern web security standards with strict nonces and zero frame embedding.
 */
export function generateCspHeader(nonce: string): { cspHeader: string; nonce: string } {
  const isDev = process.env.NODE_ENV === "development";

  // In development, Next.js hot module reloading requires eval and local websockets
  const scriptSrc = isDev
    ? `'self' 'unsafe-eval' 'nonce-${nonce}'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const cspDirectives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline'`, // Required for dynamic CSS variables and Tailwind v4 theme
    `img-src 'self' blob: data: https:`,
    `font-src 'self' data: https:`,
    `connect-src 'self' https: wss: ${isDev ? "ws: http: http://localhost:3000 http://localhost:3001 ws://localhost:3001" : ""}`,
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


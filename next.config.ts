import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  async headers() {
    // Konfiguracja CSP - różna dla development i production
    // Next.js w produkcji używa bezpiecznych inline scripts z hashami
    const scriptSrc = isDevelopment
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";
    
    const connectSrc = isDevelopment
      ? "connect-src 'self' ws://localhost:* wss://localhost:* ws://192.168.0.100:* wss://192.168.0.100:*"
      : "connect-src 'self'";

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              connectSrc,
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; ')
          }
        ],
      },
    ]
  },
};

export default nextConfig;

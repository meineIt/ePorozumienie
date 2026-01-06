import { NextRequest } from 'next/server';
import crypto from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'change-this-csrf-secret-in-production';

/**
 * Generuje CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Weryfikuje CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  const expectedToken = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(sessionToken)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(expectedToken)
  );
}

/**
 * Pobiera CSRF token z requestu
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Sprawdź nagłówek X-CSRF-Token
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Sprawdź w body (dla form data)
  // Uwaga: w Next.js 13+ App Router, body jest już sparsowane
  // Więc musimy sprawdzić w nagłówku lub cookie
  
  // Sprawdź cookie
  const cookieToken = request.cookies.get('csrf-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Middleware do weryfikacji CSRF token
 * W produkcji należy użyć sesji do przechowywania sessionToken
 */
export function validateCSRF(request: NextRequest, sessionToken: string): boolean {
  const token = getCSRFTokenFromRequest(request);
  if (!token) {
    return false;
  }

  return verifyCSRFToken(token, sessionToken);
}



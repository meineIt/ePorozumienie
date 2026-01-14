import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getTokenFromRequest } from './jwt';
import { TOKEN_LENGTH_LIMITS } from '@/lib/utils/constants';

function getCSRFSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CSRF_SECRET environment variable is required in production');
    }
    throw new Error('CSRF_SECRET environment variable is required. Please set it in your .env file');
  }
  return secret;
}

const CSRF_SECRET = getCSRFSecret();

/**
 * Generuje CSRF token na podstawie JWT token (session token)
 */
export function generateCSRFToken(sessionToken: string): string {
  return crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(sessionToken)
    .digest('hex');
}

/**
 * Weryfikuje CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  // Walidacja długości tokenu - ochrona przed atakami DoS
  if (token.length > TOKEN_LENGTH_LIMITS.CSRF_TOKEN) {
    return false;
  }

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
    // Walidacja długości tokenu - ochrona przed atakami DoS
    if (headerToken.length > TOKEN_LENGTH_LIMITS.CSRF_TOKEN) {
      return null;
    }
    return headerToken;
  }

  return null;
}

/**
 * Middleware do weryfikacji CSRF token
 * Używa JWT token jako session token
 */
export function validateCSRF(request: NextRequest): boolean {
  const token = getCSRFTokenFromRequest(request);
  if (!token) {
    return false;
  }

  const sessionToken = getTokenFromRequest(request);
  if (!sessionToken) {
    return false;
  }

  return verifyCSRFToken(token, sessionToken);
}

/**
 * Middleware do wymuszania CSRF protection w endpointach modyfikujących
 */
export function requireCSRF(request: NextRequest): NextResponse | null {
  if (!validateCSRF(request)) {
    const { logCSRFFailed } = require('@/lib/utils/securityLogger');
    logCSRFFailed('CSRF token validation failed', {
      url: request.url,
      method: request.method,
    }, request);
    return NextResponse.json(
      { error: 'Invalid or missing CSRF token' },
      { status: 403 }
    );
  }
  return null;
}



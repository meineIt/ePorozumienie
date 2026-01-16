import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromHeaders } from '../auth/middleware';
import { requireCSRF } from '@/lib/auth/csrf';
import { rateLimit } from '@/lib/auth/rateLimit';
import { tooLarge, tooManyRequests, unauthorized } from './response';

/**
 * System proxy dla API routes
 * Umożliwia kompozycyjne dodawanie zabezpieczeń i walidacji
 */

export type Proxy = (request: NextRequest) => Promise<NextResponse | null | void>;

/**
 * Proxy do sprawdzania autentykacji
 * Używa danych z headers ustawionych przez globalny proxy
 */
export async function withAuth(request: NextRequest): Promise<NextResponse | null> {
  try {
    getAuthUserFromHeaders(request);
    return null; // Autentykacja OK
  } catch {
    return unauthorized();
  }
}

/**
 * Proxy do rate limitingu
 */
export function withRateLimit(
  limit: number,
  interval: number,
  identifier: string | ((request: NextRequest) => string | Promise<string>),
  request?: { headers: Headers; url?: string }
): Proxy {
  const limiter = rateLimit({ interval, uniqueTokenPerInterval: 500 });
  
  return async (req: NextRequest): Promise<NextResponse | null> => {
    try {
      const id = typeof identifier === 'function' ? await identifier(req) : identifier;
      await limiter.check(limit, id, request || { headers: req.headers, url: req.url });
      return null; // Rate limit OK
    } catch {
      return tooManyRequests();
    }
  };
}

/**
 * Proxy do sprawdzania CSRF token
 */
export async function withCSRF(request: NextRequest): Promise<NextResponse | null> {
  const csrfError = requireCSRF(request);
  return csrfError;
}

/**
 * Proxy do sprawdzania rozmiaru requestu
 */
export function withContentLength(maxSize: number): Proxy {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > maxSize) {
      return tooLarge();
    }
    return null; // Size OK
  };
}

/**
 * Komponuje wiele Proxy w jeden
 * Wykonuje je sekwencyjnie - jeśli któryś zwróci NextResponse, przerywa wykonanie
 */
export function compose(...proxies: Proxy[]): Proxy {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    for (const proxy of proxies) {
      const result = await proxy(request);
      if (result instanceof NextResponse) {
        return result; // Zwróć błąd z proxy
      }
    }
    return null; // Wszystkie proxy przeszły
  };
}

/**
 * Helper do tworzenia route handler z proxy
 */
export function createRouteHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  ...proxies: Proxy[]
): (request: NextRequest) => Promise<NextResponse> {
  const composedProxy = compose(...proxies);
  
  return async (request: NextRequest): Promise<NextResponse> => {
    // Wykonaj proxy
    const proxyResult = await composedProxy(request);
    if (proxyResult) {
      return proxyResult; // Zwróć błąd z proxy
    }
    
    // Wykonaj handler
    return await handler(request);
  };
}

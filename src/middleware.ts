import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserEdge } from '@/lib/auth/jwt';
import { logUnauthorizedAccess } from '@/lib/utils/securityLogger';

/**
 * Lista publicznych ścieżek API, które nie wymagają autentykacji
 */
const PUBLIC_PATHS = [
  '/api/login',
  '/api/register',
  '/api/contact',
  '/api/discount',
];

/**
 * Sprawdza czy ścieżka jest publiczna
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(publicPath => pathname === publicPath);
}

/**
 * Middleware Next.js do globalnej autentykacji
 * Automatycznie weryfikuje autentykację dla wszystkich chronionych ścieżek API
 * Używa jose dla weryfikacji tokenów w Edge Runtime
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sprawdź czy to ścieżka API
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Jeśli ścieżka jest publiczna, pozwól na dostęp
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Dla wszystkich innych ścieżek API - wymagana autentykacja
  const user = await getAuthenticatedUserEdge(request);

  if (!user) {
    // Loguj próbę nieautoryzowanego dostępu
    logUnauthorizedAccess('Unauthorized access attempt - middleware', {
      headers: request.headers,
      url: request.url,
    }, {
      method: request.method,
      pathname,
    });

    return NextResponse.json(
      { error: 'Wymagana autentykacja' },
      { status: 401 }
    );
  }

  // Autentykacja pomyślna - dodaj informacje o użytkowniku do headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId);
  requestHeaders.set('x-user-email', user.email);

  // Przekaż request dalej z dodanymi headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * Konfiguracja middleware - działa tylko dla ścieżek API
 */
export const config = {
  matcher: '/api/:path*',
};

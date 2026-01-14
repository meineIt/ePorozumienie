import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from './jwt';
import { logUnauthorizedAccess } from '@/lib/utils/securityLogger';

/**
 * Middleware do weryfikacji autentykacji użytkownika
 * Zwraca null jeśli użytkownik jest autentykowany, lub NextResponse z błędem jeśli nie
 */
export function requireAuth(request: NextRequest): NextResponse | null {
  const user = getAuthenticatedUser(request);

  if (!user) {
    logUnauthorizedAccess('Unauthorized access attempt', {
      url: request.url,
      method: request.method,
    }, request);
    return NextResponse.json(
      { error: 'Wymagana autentykacja' },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Middleware do weryfikacji autentykacji i zwrócenia użytkownika
 * Rzuca błąd jeśli użytkownik nie jest autentykowany
 * 
 * @deprecated Użyj getAuthUserFromHeaders dla endpointów chronionych przez middleware
 */
export function getAuthUser(request: NextRequest): { userId: string; email: string } {
  const user = getAuthenticatedUser(request);

  if (!user) {
    logUnauthorizedAccess('Unauthorized access attempt - getAuthUser', {
      url: request.url,
      method: request.method,
    }, request);
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Pobiera dane użytkownika z headers requestu
 * Headers są ustawiane przez globalny middleware Next.js po pomyślnej autentykacji
 * 
 * @param request - NextRequest z headers zawierającymi dane użytkownika
 * @returns Dane użytkownika (userId, email)
 * @throws Error jeśli dane użytkownika nie są dostępne w headers
 */
export function getAuthUserFromHeaders(request: NextRequest): { userId: string; email: string } {
  const userId = request.headers.get('x-user-id');
  const email = request.headers.get('x-user-email');

  if (!userId || !email) {
    logUnauthorizedAccess('Unauthorized access attempt - getAuthUserFromHeaders (missing headers)', {
      url: request.url,
      method: request.method,
    }, request);
    throw new Error('Unauthorized - user data not found in headers');
  }

  return { userId, email };
}

